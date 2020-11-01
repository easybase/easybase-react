import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import EasybaseContext from "./EasybaseContext";
import deepEqual from "fast-deep-equal";
import {
    ConfigureFrameOptions,
    EasybaseProviderProps,
    AddRecordOptions,
    UpdateRecordAttachmentOptions,
    StatusResponse,
    RECORD_REF_STATUS,
    ContextValue,
    POST_TYPES,
    QueryOptions,
    FrameConfiguration
} from "./types";
import { log } from "./utils";
import imageExtensions from "./assets/image-extensions.json";
import videoExtensions from "./assets/video-extensions.json";
import {
    initAuth,
    tokenPost
} from "./auth";
import g from "./g";
import { Observable } from "./object-observer";

let _isFrameInitialized: boolean = true;

let _frameConfiguration: FrameConfiguration = {
    offset: 0,
    limit: 0
};

let _effect: React.EffectCallback = () => () => {};

const _observedChangeStack: Record<string, any>[] = [];
let _recordIdMap: WeakMap<Record<string, any>, "string"> = new WeakMap();

const EasybaseProvider = ({ children, ebconfig, options }: EasybaseProviderProps) => {
    const [mounted, setMounted] = useState<boolean>(false);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    const [_frame, _setFrame] = useState<Record<string, any>[]>([]);
    const [_observableFrame, _setObservableFrame] = useState<any>({
        observe: () => {},
        unobserve: () => {} 
    });

    if (typeof ebconfig !== 'object' || ebconfig === null || ebconfig === undefined) {
        console.error("No ebconfig object passed. do `import ebconfig from \"ebconfig.json\"` and pass it to the Easybase provider");
        return (
            <Fragment>
                {children}
            </Fragment>
        );
    } else if (!ebconfig.integration || !ebconfig.tt) {
        console.error("Invalid ebconfig object passed. Download ebconfig.json from Easybase.io and try again.");
        return (
            <Fragment>
                {children}
            </Fragment>
        );
    }

    useEffect(() => {
        const mount = async () => {
            // eslint-disable-next-line dot-notation
            const isIE = !!document['documentMode'];

            if (isIE) {
                console.error("EASYBASE — easybase-react does not support Internet Explorer. Please use a different browser.");
            }

            if (options) {
                g.options = { ...g.options, ...options };
            }
            g.integrationID = ebconfig.integration;
            g.ebconfig = ebconfig;

            const t1 = Date.now();
            log("mounting");
            await initAuth();
            const res = await tokenPost(POST_TYPES.VALID_TOKEN, {});
            const elapsed = Date.now() - t1;
            if (res.success) {
                log("Valid auth initiation in " + elapsed + "ms");
                setMounted(true);
            }
        }

        mount();
    }, []);

    const useFrameEffect = (effect: React.EffectCallback) => {
        _effect = effect;
    };

    useEffect(() => {
        _observableFrame.observe((allChanges: any[]) => {
            allChanges.forEach((change: any) => {
                _observedChangeStack.push({
                    type: change.type,
                    path: change.path,
                    value: change.value,
                    _id: _recordIdMap.get(_frame[Number(change.path[0])])
                    // Not bringing change.object or change.oldValue
                });
                log(JSON.stringify({
                    type: change.type,
                    path: change.path,
                    value: change.value,
                    _id: _recordIdMap.get(_frame[Number(change.path[0])])
                    // Not bringing change.object or change.oldValue
                }))
            });
        });

        _effect(); // call useFrameEffect
    }, [_observableFrame]);

    useEffect(() => {
        _observableFrame.unobserve();
        _setObservableFrame(Observable.from(_frame));
    }, [_frame]);

    function Frame(): Record<string, any>[];
    function Frame(index: number): Record<string, any>;
    function Frame(index?: number): Record<string, any>[] | Record<string, any> {
        if (typeof index === "number") {
            return _observableFrame[index];
        } else {
            return _observableFrame;
        }
    }

    const Query = async (options: QueryOptions): Promise<Record<string, any>[]> => {
        const defaultOptions: QueryOptions = {
            queryName: ""
        }

        const fullOptions: QueryOptions = { ...defaultOptions, ...options };

        try {
            const res = await tokenPost(POST_TYPES.GET_QUERY, fullOptions);
            return res.data
        } catch (error) {
            return [];
        }
    }

    const configureFrame = (options: ConfigureFrameOptions): StatusResponse => {
        if (options.limit === _frameConfiguration.limit && options.offset === _frameConfiguration.offset) {
            return {
                message: "Frame parameters are the same as the previous configuration.",
                success: true
            };
        }

        _frameConfiguration = { ..._frameConfiguration };

        if (options.limit !== undefined && options.limit >= 0) _frameConfiguration.limit = options.limit;
        if (options.offset !== undefined && options.offset >= 0) _frameConfiguration.offset = options.offset;

        _isFrameInitialized = false;
        return {
            message: "Successfully configured frame. Run sync() for changes to be shown in frame",
            success: true
        }
    }

    const currentConfiguration = (): FrameConfiguration => ({ ..._frameConfiguration });

    const _validateRecord = (record: Record<string, any>): RECORD_REF_STATUS => {
        if (_recordIdMap.get(record)) {
            return RECORD_REF_STATUS.ID_VALID;
        } else {
            return RECORD_REF_STATUS.NO_ID;
        }
    }

    const addRecord = async (options: AddRecordOptions): Promise<StatusResponse> => {
        const defaultValues: AddRecordOptions = {
            insertAtEnd: false,
            newRecord: {}
        }

        const fullOptions: AddRecordOptions = { ...defaultValues, ...options };

        try {
            const res = await tokenPost(POST_TYPES.SYNC_INSERT, fullOptions);
            return {
                message: res.data,
                success: res.success
            }
        } catch (err) {
            console.error("Easybase Error: addRecord failed ", err);
            return {
                message: "Easybase Error: addRecord failed " + err,
                success: false,
                error: err
            }
        }
    }

    const deleteRecord = async (record: Record<string, any> | {}): Promise<StatusResponse> => {
        const _frameRecord = _frame.find(ele => deepEqual(ele, record));

        if (_frameRecord && _recordIdMap.get(_frameRecord)) {
            const res = await tokenPost(POST_TYPES.SYNC_DELETE, {
                _id: _recordIdMap.get(_frameRecord)
            });
            return {
                success: res.success,
                message: res.data
            }
        } else {
            try {
                const res = await tokenPost(POST_TYPES.SYNC_DELETE, {
                    record
                });
                return {
                    success: res.success,
                    message: res.data
                }
            } catch (err) {
                console.error("Easybase Error: deleteRecord failed ", err);
                return {
                    success: false,
                    message: "Easybase Error: deleteRecord failed " + err,
                    error: err
                }
            }
        }
    }

    const fullTableSize = async (): Promise<number> => {
        const res = await tokenPost(POST_TYPES.TABLE_SIZE, {});
        if (res.success) {
            return res.data;
        } else {
            return 0;
        }
    }

    const tableTypes = async (): Promise<Record<string, any>> => {
        const res = await tokenPost(POST_TYPES.COLUMN_TYPES, {});
        if (res.success) {
            return res.data;
        } else {
            return {};
        }
    }

    // Only allow the deletion of one element at a time
    // First handle shifting of the array size. Then iterate
    const sync = async (): Promise<StatusResponse> => {
        const _realignFrames = (newData: Record<string, any>[]) => {
            let isNewDataTheSame = true;

            if (newData.length !== _frame.length) {
                isNewDataTheSame = false;
            } else {
                for (let i = 0; i < newData.length; i++) {
                    const newDataNoId = { ...newData[i] };
                    delete newDataNoId._id;
                    if (!deepEqual(newDataNoId, _frame[i])) {
                        isNewDataTheSame = false;
                        break;
                    }
                }
            }

            !isNewDataTheSame && _setFrame(oldframe => {
                oldframe.length = newData.length;
                _recordIdMap = new WeakMap();
                for (let i = 0; i < newData.length; i++) {
                    const currNewEle = newData[i];
                    _recordIdMap.set(currNewEle, currNewEle._id);
                    delete currNewEle._id;
                    oldframe[i] = currNewEle;
                }
                return [...oldframe];
            });
        }

        if (isSyncing) {
            return {
                success: false,
                message: "Easybase Error: the provider is currently syncing, use 'await sync()' before calling sync() again"
            };
        }
        setIsSyncing(true);

        const { offset, limit }: ConfigureFrameOptions = _frameConfiguration;

        if (_isFrameInitialized) {
            if (_observedChangeStack.length > 0) {
                log("Stack change: ", _observedChangeStack);
                const res = await tokenPost(POST_TYPES.SYNC_STACK, {
                    stack: _observedChangeStack,
                    limit,
                    offset
                });
                console.log(res.data);
                if (res.success) {
                    _observedChangeStack.length = 0;
                }
            }
        }

        try {
            const res = await tokenPost(POST_TYPES.GET_FRAME, {
                offset,
                limit
            });

            // Check if the array recieved from db is the same as frame
            // If not, update it and send useFrameEffect

            if (res.success === false) {
                console.error(res.data);
                setIsSyncing(false);
                return {
                    success: false,
                    message: "" + res.data
                }
            } else {
                _isFrameInitialized = true;
                _realignFrames(res.data);
                setIsSyncing(false);
                return {
                    message: 'Success. Call frame for data',
                    success: true
                }
            }
        } catch (err) {
            console.error("Easybase Error: get failed ", err);
            setIsSyncing(false);
            return {
                success: false,
                message: "Easybase Error: get failed " + err,
                error: err
            }
        }
    }

    const updateRecordImage = async (options: UpdateRecordAttachmentOptions): Promise<StatusResponse> => {
        const res = await _updateRecordAttachment(options, "image");
        return res;
    }

    const updateRecordVideo = async (options: UpdateRecordAttachmentOptions): Promise<StatusResponse> => {
        const res = await _updateRecordAttachment(options, "video");
        return res;
    }
    const updateRecordFile = async (options: UpdateRecordAttachmentOptions): Promise<StatusResponse> => {
        const res = await _updateRecordAttachment(options, "file");
        return res;
    }

    const _updateRecordAttachment = async (options: UpdateRecordAttachmentOptions, type: string): Promise<StatusResponse> => {
        switch (_validateRecord(options.record)) {
            case RECORD_REF_STATUS.NO_ID:
                console.log("Attempting to add attachment to a new record that has not been synced. Please sync() before trying to add attachment.");
                return {
                    success: false,
                    message: "Attempting to add attachment to a new record that has not been synced. Please sync() before trying to add attachment."
                }
            default:
                break;
        }

        const ext = options.attachment.name.split(".").pop();

        switch (type) {
            case "image":
                if (!imageExtensions.includes(ext!.toLowerCase())) {
                    return {
                        success: false,
                        message: "Image files must have a proper image extension in the file name"
                    };
                }
                break;
            case "video":
                if (!videoExtensions.includes(ext!.toLowerCase())) {
                    return {
                        success: false,
                        message: "Video files must have a proper video extension in the file name"
                    };
                }
                break;
            default:
                break;
        }

        const formData = new FormData();
        formData.append("file", options.attachment, options.attachment.name);

        try {
            const res = await axios.post(`https://api.easybase.io/react/${g.integrationID}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    uploadType: type,
                    columnName: options.columnName,
                    recordID: _recordIdMap.get(options.record),
                    'Eb-Post-Req': POST_TYPES.UPLOAD_ATTACHMENT
                }
            });

            if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) {
                console.error(res.data.message);
                return {
                    success: false,
                    message: res.data.message
                }
            } else {
                return {
                    message: 'Successfully added attachment',
                    success: true
                }
            }
        } catch (error) {
            return {
                success: false,
                message: "Axios post error",
                error: error
            }
        }
    }

    const c: ContextValue = {
        configureFrame,
        addRecord,
        deleteRecord,
        sync,
        updateRecordImage,
        updateRecordVideo,
        updateRecordFile,
        Frame,
        useFrameEffect,
        fullTableSize,
        tableTypes,
        currentConfiguration,
        Query
    }

    return (
        <EasybaseContext.Provider value={c}>
            {mounted && children}
        </EasybaseContext.Provider>
    )
}

export default EasybaseProvider;
