import React, { useState, useEffect, useRef, Fragment } from "react";
import axios from "axios";
import EasybaseContext from "./EasybaseContext";
import {
    ConfigureFrameOptions,
    EasybaseProviderProps,
    AddRecordOptions,
    UpdateRecordAttachmentOptions,
    StatusResponse,
    RECORD_REF_STATUS,
    ContextValue,
    POST_TYPES,
    QueryOptions
} from "./types";
import {
    generateBareUrl,
    shallowCompare
} from "./utils";
import imageExtensions from "./assets/image-extensions.json";
import videoExtensions from "./assets/video-extensions.json";
import {
    initAuth,
    tokenPost
} from "./auth";
import g from "./g";

const _symb: any = Symbol("_id");

const EasybaseProvider = ({ children, ebconfig, authentication }: EasybaseProviderProps) => {
    const [mounted, setMounted] = useState<boolean>(false);

    const [frame, setFrame] = useState<Record<string, unknown>[]>([]);
    const _frameReference: Record<string, unknown>[] = [];

    let _isFrameInitialized: boolean = true;
    let _frameConfiguration: ConfigureFrameOptions = {
        offset: 0,
        limit: undefined
    };

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

    g.integrationID = ebconfig.integration;
    g.ebconfig = ebconfig;

    useEffect(() => {
        const mount = async () => {
            const t1 = Date.now();
            console.log("EASYBASE — mounting");
            await initAuth();
            const res = await tokenPost(POST_TYPES.VALID_TOKEN, {});
            const elapsed = Date.now() - t1;
            if (res.success) {
                console.log("EASYBASE — Valid auth initiation in " + elapsed + "ms");
                setMounted(true);
            }
        }
        mount();
    }, []);

    let _effect: React.EffectCallback = () => () => {};

    const useFrameEffect = (effect: React.EffectCallback) => {
        _effect = effect;
    };

    useEffect(_effect, [frame]);

    const Frame = (): Record<string, unknown>[] => frame;

    const Query = (options: QueryOptions): Record<string, unknown>[] => []; // TODO: search and sort

    const configureFrame = (options: ConfigureFrameOptions): StatusResponse => {
        if (options.limit === _frameConfiguration.limit && options.offset === _frameConfiguration.offset) {
            return {
                message: "Frame parameters are the same as the previous configuration.",
                success: true
            };
        }

        _frameConfiguration = { ..._frameConfiguration, ...options };
        _isFrameInitialized = false;
        return {
            message: "Successfully configured frame. Run sync() for changes to be shown in frame",
            success: true
        }
    }

    const _validateRecord = (record: Record<string, unknown>): RECORD_REF_STATUS => {
        if (record[_symb]) {
            const _refRecord = _frameReference.find(ele => ele[_symb] === record[_symb]);
            if (_refRecord === undefined) {
                return RECORD_REF_STATUS.NO_REF_WITH_ID;
            } else {
                if (shallowCompare(record, _refRecord)) {
                    return RECORD_REF_STATUS.SAME_AS_REF;
                } else {
                    return RECORD_REF_STATUS.DIFFERENT_FROM_REF;
                }
            }
        } else {
            return RECORD_REF_STATUS.NO_ID;
        }
    }

    const addRecord = async (options: AddRecordOptions): Promise<StatusResponse> => {
        const defaultValues: AddRecordOptions = {
            insertAtEnd: undefined,
            copyIfExists: undefined,
            newRecord: {}
        }

        const { insertAtEnd, copyIfExists, newRecord }: AddRecordOptions = { ...defaultValues, ...options };

        try {
            const res = await axios.post(generateBareUrl("REACT", g.integrationID), {
                _config: {
                    type: "addRecord",
                    insertAtEnd,
                    copyIfExists,
                    newRecord
                }
            });
            if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) {
                console.error(res.data.message);
                return {
                    message: res.data.message,
                    success: false
                }
            } else {
                return {
                    message: res.data.message,
                    success: true
                }
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

    const deleteRecord = async (record: Record<string, unknown> | {}): Promise<StatusResponse> => {
        switch (_validateRecord(record)) {
            case RECORD_REF_STATUS.NO_ID:
                console.log("Attempting to delete record that has not been synced. Just remove the element from the array.");
                return {
                    success: false,
                    message: "Attempting to delete record that has not been synced. Just remove the element from the array."
                }
            default:
                break;
        }

        try {
            const res = await axios.post(generateBareUrl("REACT", g.integrationID), {
                _config: {
                    type: "deleteRecord",
                    id: record[_symb]
                }
            });
            if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) {
                console.error(res.data.message);
                return {
                    message: res.data.message,
                    success: false
                }
            }
            return {
                message: res.data.message,
                success: true
            }
        } catch (err) {
            console.error("Easybase Error: addRecord failed ", err);
            return {
                success: false,
                message: "Easybase Error: addRecord failed " + err,
                error: err
            }
        }
    }

    const updateRecord = async (record: Record<string, unknown> | {}): Promise<StatusResponse> => {
        try {
            const res = await axios.post(generateBareUrl("REACT", g.integrationID), {
                _config: {
                    type: "deleteRecord",
                    id: record[_symb],
                    values: record
                }
            });
            if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) {
                console.error(res.data.message);
                return {
                    message: res.data.message,
                    success: false
                }
            } else {
                return {
                    message: res.data.message,
                    success: true
                }
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

    // Only allow the deletion of one element at a time
    const sync = async (): Promise<StatusResponse> => {
        const _realignFrames = (newData: Record<string, unknown>[]) => {
            let isNewDataTheSame = true;

            if (newData.length !== frame.length) {
                isNewDataTheSame = false;
            } else {
                for (let i = 0; i < newData.length; i++) {
                    if (!shallowCompare(newData[i], frame[i])) {
                        isNewDataTheSame = false;
                        break;
                    }
                }
            }

            !isNewDataTheSame && setFrame(_frame => {
                _frame.length = newData.length;
                _frameReference.length = newData.length;

                for (let i = 0; i < newData.length; i++) {
                    const copyEle = Object.assign({}, newData[i]);

                    Object.defineProperty(newData[i], _symb, {
                        enumerable: false,
                        get: function () { return `${newData[i]._id}` },
                        set: function () { }
                    });

                    Object.defineProperty(copyEle, _symb, {
                        enumerable: false,
                        get: function () { return `${newData[i]._id}` },
                        set: function () { }
                    });

                    delete newData[i]._id;
                    delete copyEle._id;

                    _frame[i] = newData[i];
                    _frameReference[i] = copyEle;
                }
                return [..._frame];
            });
        }

        const { offset, limit }: ConfigureFrameOptions = _frameConfiguration;

        if (_isFrameInitialized) {
            // Check to see if any element were delete (Only 1)
            for (const referenceEle of _frameReference) {
                if (!frame.some(ele => ele[_symb] === referenceEle[_symb])) {
                    await deleteRecord(referenceEle);
                    break;
                }
            }

            // Check to see if any elements were added or updated
            for (let i = 0; i < frame.length; i++) {
                const currEle = frame[i];

                if (currEle[_symb] === undefined) {
                    await addRecord({
                        newRecord: currEle,
                        absoluteIndex: i + offset!
                    });
                } else {
                    const referenceEle = _frameReference.find(ele => ele[_symb] === currEle[_symb]);
                    if (referenceEle !== undefined && !shallowCompare(currEle, referenceEle)) {
                        await updateRecord(currEle)
                    }
                }
            }
        }

        try {
            const res = await tokenPost(POST_TYPES.GET_FRAME, {
                offset,
                limit
            });

            // check if the arrays are the same

            if (res.success === false) {
                console.error(res.data);
                return {
                    success: false,
                    message: "" + res.data
                }
            } else {
                _isFrameInitialized = true;
                _realignFrames((res.data as Record<string, unknown>[]));
                return {
                    message: 'Success. Call frame for data',
                    success: true
                }
            }
        } catch (err) {
            console.error("Easybase Error: get failed ", err);
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
                    recordID: options.record[_symb],
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
        updateRecord,
        sync,
        updateRecordImage,
        updateRecordVideo,
        updateRecordFile,
        Frame,
        useFrameEffect
    }

    return (
        <EasybaseContext.Provider value={c}>
            {children}
        </EasybaseContext.Provider>
    )
}

export default EasybaseProvider;
