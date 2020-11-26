import React, { useState, useEffect, Fragment } from "react";
import EasybaseContext from "./EasybaseContext";
import deepEqual from "fast-deep-equal";
import {
    EasybaseProviderProps,
    ContextValue
} from "./reactTypes";
import {
    POST_TYPES,
    FrameConfiguration,
    FileFromURI,
    AddRecordOptions,
    UpdateRecordAttachmentOptions,
    StatusResponse,
    ConfigureFrameOptions,
    DeleteRecordOptions
} from "../node_modules/easybasejs/src/EasybaseProvider/types";
import imageExtensions from "./assets/image-extensions.json";
import videoExtensions from "./assets/video-extensions.json";
import utilsFactory from "../node_modules/easybasejs/src/EasybaseProvider/utils";
import functionsFactory from "../node_modules/easybasejs/src/EasybaseProvider/functions";
import authFactory from "../node_modules/easybasejs/src/EasybaseProvider/auth";
import { gFactory } from "../node_modules/easybasejs/src/EasybaseProvider/g";
import { Observable } from "object-observer";
import Cookies from 'universal-cookie';

const g = gFactory();

const {
    initAuth,
    tokenPost,
    tokenPostAttachment,
    signUp,
    setUserAttribute,
    getUserAttributes,
    signIn,
    signOut
} = authFactory(g);
const { log, generateBareUrl } = utilsFactory(g);
const { 
    Query,
    fullTableSize,
    tableTypes
 } = functionsFactory(g);

let _isFrameInitialized: boolean = true;

let _frameConfiguration: FrameConfiguration = {
    offset: 0,
    limit: 0
};

const cookies = new Cookies();

let _effect: React.EffectCallback = () => () => { };

const _observedChangeStack: Record<string, any>[] = [];
let _recordIdMap: WeakMap<Record<string, any>, "string"> = new WeakMap();

const EasybaseProvider = ({ children, ebconfig, options }: EasybaseProviderProps) => {
    const [mounted, setMounted] = useState<boolean>(false);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [userSignedIn, setUserSignedIn] = useState<boolean>(false);

    const [_frame, _setFrame] = useState<Record<string, any>[]>([]);
    const [_observableFrame, _setObservableFrame] = useState<any>({
        observe: () => { },
        unobserve: () => { }
    });

    if (typeof ebconfig !== 'object' || ebconfig === null || ebconfig === undefined) {
        console.error("No ebconfig object passed. do `import ebconfig from \"ebconfig.json\"` and pass it to the Easybase provider");
        return (
            <Fragment>
                {children}
            </Fragment>
        );
    } else if (!ebconfig.integration) {
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
            const isIE = typeof document !== 'undefined' && !!document['documentMode'];

            if (isIE) {
                console.error("EASYBASE — easybase-react does not support Internet Explorer. Please use a different browser.");
            }

            g.instance = (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') ? "React Native" : "React";
            g.options = { ...options };
            g.integrationID = ebconfig.integration;
            g.ebconfig = ebconfig;

            if (g.ebconfig.tt && g.ebconfig.integration.split("-")[0].toUpperCase() !== "PROJECT") {
                const t1 = Date.now();
                log("mounting...");
                await initAuth();
                const res = await tokenPost(POST_TYPES.VALID_TOKEN);
                const elapsed = Date.now() - t1;
                if (res.success) {
                    log("Valid auth initiation in " + elapsed + "ms");
                    setMounted(true);
                }
            } else {
                setMounted(true);
                g.mounted = true;

                const cookieName = g.ebconfig.integration.slice(-10);

                if (cookies.get(cookieName + "token") && cookies.get(cookieName + "refreshToken") && cookies.get(cookieName + "session")) {
                    g.token = cookies.get(cookieName + "token");
                    g.refreshToken = cookies.get(cookieName + "refreshToken");
                    g.session = cookies.get(cookieName + "session");
                    setUserSignedIn(true);
                }
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

    const _recordIDExists = (record: Record<string, any>): Boolean => !!_recordIdMap.get(record);

    const configureFrame = (options: ConfigureFrameOptions): StatusResponse => {
        _frameConfiguration = { ..._frameConfiguration };

        if (options.limit !== undefined) _frameConfiguration.limit = options.limit;
        if (options.offset !== undefined && options.offset >= 0) _frameConfiguration.offset = options.offset;
        if (options.tableName !== undefined) _frameConfiguration.tableName = options.tableName;

        _isFrameInitialized = false;
        return {
            message: "Successfully configured frame. Run sync() for changes to be shown in frame",
            success: true
        }
    }

    const currentConfiguration = (): FrameConfiguration => ({ ..._frameConfiguration });

    const addRecord = async (options: AddRecordOptions): Promise<StatusResponse> => {
        const defaultValues: AddRecordOptions = {
            insertAtEnd: false,
            newRecord: {},
            tableName: undefined
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

    const deleteRecord = async (options: DeleteRecordOptions): Promise<StatusResponse> => {
        const _frameRecord = _frame.find(ele => deepEqual(ele, options.record));

        if (_frameRecord && _recordIdMap.get(_frameRecord)) {
            const res = await tokenPost(POST_TYPES.SYNC_DELETE, {
                _id: _recordIdMap.get(_frameRecord),
                tableName: options.tableName
            });
            return {
                success: res.success,
                message: res.data
            }
        } else {
            try {
                const res = await tokenPost(POST_TYPES.SYNC_DELETE, {
                    record: options.record,
                    tableName: options.tableName
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

        if (_isFrameInitialized) {
            if (_observedChangeStack.length > 0) {
                log("Stack change: ", _observedChangeStack);
                const res = await tokenPost(POST_TYPES.SYNC_STACK, {
                    stack: _observedChangeStack,
                    ..._frameConfiguration
                });
                if (res.success) {
                    _observedChangeStack.length = 0;
                }
            }
        }

        try {
            const res = await tokenPost(POST_TYPES.GET_FRAME, _frameConfiguration);

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
        const _frameRecord: Record<string, any> | undefined = _frame.find(ele => deepEqual(ele, options.record));

        if (_frameRecord === undefined || !_recordIDExists(_frameRecord)) {
            log("Attempting to add attachment to a new record that has not been synced. Please sync() before trying to add attachment.");
            return {
                success: false,
                message: "Attempting to add attachment to a new record that has not been synced. Please sync() before trying to add attachment."
            }
        }

        const ext: string = options.attachment.name.split(".").pop()!.toLowerCase();

        log(ext);

        if (type === "image" && !imageExtensions.includes(ext)) {
            return {
                success: false,
                message: "Image files must have a proper image extension in the file name"
            };
        }

        if (type === "video" && !videoExtensions.includes(ext)) {
            return {
                success: false,
                message: "Video files must have a proper video extension in the file name"
            };
        }

        function isFileFromURI(f: File | FileFromURI): f is FileFromURI {
            return (f as FileFromURI).uri !== undefined;
        }

        const formData = new FormData();

        if (isFileFromURI(options.attachment)) {
            formData.append("file", options.attachment as any);
            formData.append("name", options.attachment.name);
        } else {
            formData.append("file", options.attachment);
            formData.append("name", options.attachment.name);
        }

        const customHeaders = {
            'Eb-upload-type': type,
            'Eb-column-name': options.columnName,
            'Eb-record-id': _recordIdMap.get(_frameRecord),
            'Eb-table-name': options.tableName
        }

        const res = await tokenPostAttachment(formData, customHeaders);

        await sync();

        return {
            message: res.data,
            success: res.success
        };
    }

    const isUserSignedIn = (): boolean => userSignedIn;

    g.newTokenCallback = () => {
        const cookieName = g.ebconfig.integration.slice(-10);

        if (!g.token) {
            // User signed out
            cookies.remove(cookieName + "token");
            cookies.remove(cookieName + "refreshToken");
            cookies.remove(cookieName + "session");
            setUserSignedIn(false);
        } else {
            // User signed in or refreshed token
            setUserSignedIn(true);
            cookies.set(cookieName + "token", g.token, {
                expires: new Date(Date.now() + 900000)
            });
            cookies.set(cookieName + "refreshToken", g.refreshToken, {
                expires: new Date(Date.now() + (3600 * 1000 * 24))
            });
            cookies.set(cookieName + "session", g.session, {
                expires: new Date(Date.now() + (3600 * 1000 * 24))
            });
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
        Query,
        signIn,
        signOut,
        isUserSignedIn,
        signUp,
        setUserAttribute,
        getUserAttributes
    }

    return (
        <EasybaseContext.Provider value={c}>
            {mounted && children}
        </EasybaseContext.Provider>
    )
}

export default EasybaseProvider;
