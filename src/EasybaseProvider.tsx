import React, { useState, useEffect, Fragment, useRef } from "react";
import EasybaseContext from "./EasybaseContext";
import deepEqual from "fast-deep-equal";
import {
    EasybaseProviderProps,
    ContextValue,
    UseReturnValue,
    POST_TYPES,
    FrameConfiguration,
    FileFromURI,
    AddRecordOptions,
    UpdateRecordAttachmentOptions,
    StatusResponse,
    ConfigureFrameOptions,
    DeleteRecordOptions,
    DB_STATUS,
    EXECUTE_COUNT
} from "./types/types";
import imageExtensions from "./assets/image-extensions.json";
import videoExtensions from "./assets/video-extensions.json";
import utilsFactory from "../node_modules/easybasejs/src/EasybaseProvider/utils";
import tableFactory from "../node_modules/easybasejs/src/EasybaseProvider/table";
import authFactory from "../node_modules/easybasejs/src/EasybaseProvider/auth";
import dbFactory from "../node_modules/easybasejs/src/EasybaseProvider/db";
import { gFactory } from "../node_modules/easybasejs/src/EasybaseProvider/g";
import { Observable } from "object-observer";
import { SQW } from "easyqb/types/sq";
import fetch from 'cross-fetch';
const cache = require("./cache");

let _isFrameInitialized: boolean = true;

let _frameConfiguration: FrameConfiguration = {
    offset: 0,
    limit: 0
};

let _effect: React.EffectCallback = () => () => { };
let _signInCallback: () => void;

const _observedChangeStack: Record<string, any>[] = [];
let _recordIdMap: WeakMap<Record<string, any>, "string"> = new WeakMap();
let _proxyRecordMap: WeakMap<Record<string, any>, "string"> = new WeakMap();

const EasybaseProvider = ({ children, ebconfig, options }: EasybaseProviderProps) => {
    if (typeof ebconfig !== 'object' || ebconfig === null || ebconfig === undefined) {
        console.error("No ebconfig object passed. do `import ebconfig from \"./ebconfig.js\"` and pass it to the Easybase provider");
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

    const [mounted, setMounted] = useState<boolean>(false);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);
    const [userSignedIn, setUserSignedIn] = useState<boolean>(false);

    const [_frame, _setFrame] = useState<Record<string, any>[]>([]);
    const [_observableFrame, _setObservableFrame] = useState<any>({
        observe: () => { },
        unobserve: () => { }
    });

    const _ranSignInCallback = useRef<boolean>(false);

    // TODO: useRef vs useState({})
    const g = useRef(gFactory({ ebconfig, options })).current;

    const {
        initAuth,
        tokenPost,
        tokenPostAttachment,
        signUp,
        setUserAttribute,
        getUserAttributes,
        resetUserPassword,
        signIn,
        signOut,
        forgotPassword,
        forgotPasswordConfirm,
        userID
    } = useRef(authFactory(g)).current;

    const { log } = useRef(utilsFactory(g)).current;

    const {
        Query,
        fullTableSize,
        tableTypes
    } = useRef(tableFactory(g)).current;

    const {
        db,
        dbEventListener,
        e
    } = useRef(dbFactory(g)).current;

    useEffect(() => {
        const mount = async () => {
            // eslint-disable-next-line dot-notation
            const isIE = typeof document !== 'undefined' && !!document['documentMode'];

            if (isIE) {
                console.error("EASYBASE — easybase-react does not support Internet Explorer. Please use a different browser.");
            }

            g.instance = (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') ? "React Native" : "React";

            if (options?.googleAnalyticsId) {
                if (options.googleAnalyticsId.startsWith("G-")) {
                    if (g.instance === "React") {
                        const { GA4React } = await import('ga-4-react');
                        const ga4ReactLoader = new GA4React(options.googleAnalyticsId);
                        try {
                            const ga4React = await ga4ReactLoader.initialize();
                            g.analyticsEvent = (eventTitle: string, params?: Record<string, any>) => ga4React.gtag('event', eventTitle, params);
                            g.analyticsIdentify = (hashedUserId: string) => ga4React.gtag('config', options.googleAnalyticsId, { user_id: hashedUserId });
                            g.analyticsEnabled = true;
                            if (window.location.hash) {
                                // Using hash router - https://github.com/unrealmanu/ga-4-react/issues/15
                                window.onhashchange = () => {
                                    ga4React.pageview(window.location.hash);
                                };
                            }
                        } catch (error) {
                            log("Analytics initialization error: ", error)
                        }
                    } else if (g.instance === "React Native") {
                        if (options.googleAnalyticsSecret) {
                            const genUUID = () => {
                                // https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
                                let dt = new Date().getTime();
                                const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                                    const r = (dt + Math.random() * 16) % 16 | 0;
                                    dt = Math.floor(dt / 16);
                                    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                                });
                                return uuid;
                            }

                            let _userIdHash: string;
                            const _mockDeviceId = genUUID();

                            // Mocking a 'pageview'
                            fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${options.googleAnalyticsId}&api_secret=${options.googleAnalyticsSecret}`, {
                                method: "POST",
                                body: JSON.stringify({
                                    client_id: _mockDeviceId,
                                    events: [{ name: 'select_content' }]
                                })
                            });

                            g.analyticsEvent = (eventTitle: string, params?: Record<string, any>) => fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${options.googleAnalyticsId}&api_secret=${options.googleAnalyticsSecret}`, {
                                method: "POST",
                                body: JSON.stringify({
                                    client_id: _mockDeviceId,
                                    user_id: _userIdHash,
                                    events: [{
                                        name: eventTitle,
                                        params
                                    }]
                                })
                            });
                            g.analyticsIdentify = (hashedUserId: string) => { _userIdHash = hashedUserId };
                            g.analyticsEnabled = true;
                        } else {
                            console.error("EASYBASE — React Native analytics requires the presence of 'googleAnalyticsSecret'. To create a new secret, navigate in the Google Analytics UI to: Admin > Data Streams > choose your stream > Measurement Protocol > Create");
                        }
                    }
                } else if (options.googleAnalyticsId.startsWith("UA-")) {
                    console.error("EASYBASE — Detected Universal Analytics tag in googleAnalyticsId parameter. This version is not supported – please update to Google Analytics 4.\nhttps://support.google.com/analytics/answer/9744165?hl=en");
                } else {
                    console.error("EASYBASE — Unknown googleAnalyticsId version parameter. Please use Google Analytics 4.\nhttps://support.google.com/analytics/answer/9744165?hl=en");
                }
            }

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
                g.mounted = true; // Bypass initAuth()

                const cookieName = g.ebconfig.integration.slice(-10);

                const {
                    cacheToken,
                    cacheRefreshToken,
                    cacheSession
                } = await cache.getCacheTokens(cookieName);

                if (cacheRefreshToken) {
                    g.token = cacheToken;
                    g.refreshToken = cacheRefreshToken;
                    g.session = +cacheSession;

                    const fallbackMount = setTimeout(() => { setMounted(true) }, 2500);

                    const [refreshTokenRes, { hash }, { fromUtf8 }] = await Promise.all([
                        tokenPost(POST_TYPES.REQUEST_TOKEN, {
                            refreshToken: g.refreshToken,
                            token: g.token,
                            getUserID: true
                        }),
                        import('fast-sha256'),
                        import('@aws-sdk/util-utf8-browser')
                    ])

                    if (refreshTokenRes.success) {
                        clearTimeout(fallbackMount);
                        g.token = refreshTokenRes.data.token;
                        g.userID = refreshTokenRes.data.userID;
                        if (g.analyticsEnabled && g.analyticsEventsToTrack.login) {
                            const hashOut = hash(fromUtf8(g.GA_USER_ID_SALT + refreshTokenRes.data.userID));
                            const hexHash = Array.prototype.map.call(hashOut, x => ('00' + x.toString(16)).slice(-2)).join('');
                            g.analyticsIdentify(hexHash);
                            g.analyticsEvent('login', { method: "Easybase" });
                        }
                        await cache.setCacheTokens(g, cookieName);
                        setUserSignedIn(true);
                    } else {
                        cache.clearCacheTokens(cookieName);
                    }
                }

                setMounted(true);
            }
        }

        mount();
    }, []);

    const useFrameEffect = (effect: React.EffectCallback) => {
        _effect = effect;
    };

    useEffect(() => {
        if (userSignedIn === true && _ranSignInCallback.current === false && _signInCallback !== undefined) {
            _signInCallback();
            _ranSignInCallback.current = true;
        }
    }, [userSignedIn])

    const onSignIn = (callback: () => void) => {
        _signInCallback = callback;

        if (userSignedIn === true && _ranSignInCallback.current === false && _signInCallback !== undefined) {
            _signInCallback();
            _ranSignInCallback.current = true;
        }
    }

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

        _proxyRecordMap = new WeakMap();
        _frame.forEach((_: any, i: number) => _proxyRecordMap.set(_observableFrame[i], "" + i as any))

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

    const _recordIDExists = (record: Record<string, any>): Boolean => !!_recordIdMap.get(record) || !!_recordIdMap.get(_getRawRecordFromProxy(record) || {});
    const _getRawRecordFromProxy = (proxyRecord: Record<string, any>): Record<string, any> | undefined => _proxyRecordMap.get(proxyRecord) ? _frame[+_proxyRecordMap.get(proxyRecord)!] : undefined

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
                errorCode: err
            }
        }
    }

    const deleteRecord = async (options: DeleteRecordOptions): Promise<StatusResponse> => {
        const _frameRecord = _getRawRecordFromProxy(options.record) || _frame.find(ele => deepEqual(ele, options.record));

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
            } catch (error) {
                console.error("Easybase Error: deleteRecord failed ", error);
                return {
                    success: false,
                    message: "Easybase Error: deleteRecord failed " + error,
                    errorCode: error.errorCode || undefined
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

            if (!isNewDataTheSame) {
                _recordIdMap = new WeakMap();
                _frame.length = newData.length;

                newData.forEach((currNewEle, i) => {
                    _frame[i] = currNewEle;
                    _recordIdMap.set(currNewEle, currNewEle._id);
                    delete currNewEle._id;
                });
                _setFrame([..._frame]);
            }
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

            // Check if the array received from db is the same as frame
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
        } catch (error) {
            console.error("Easybase Error: get failed ", error);
            setIsSyncing(false);
            return {
                success: false,
                message: "Easybase Error: get failed " + error,
                errorCode: error.errorCode || undefined
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
        const _frameRecord: Record<string, any> | undefined = _getRawRecordFromProxy(options.record) || _frame.find(ele => deepEqual(ele, options.record));

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
            cache.clearCacheTokens(cookieName).then((_: any) => {
                setUserSignedIn(false);
                _ranSignInCallback.current = false;
            });
        } else {
            // User signed in or refreshed token
            cache.setCacheTokens(g, cookieName).then((_: any) => {
                setUserSignedIn(true);
            });
        }
    }

    const useReturn = (dbInstance: () => SQW, deps?: React.DependencyList): UseReturnValue => {
        // eslint-disable-next-line no-extra-parens
        const [unsubscribe, setUnsubscribe] = useState<() => void>(() => () => { });
        const [frame, setFrame] = useState<Record<string, any>[]>([]);
        const [error, setError] = useState<any>(null);
        const [loading, setLoading] = useState<boolean>(false);
        const [dead, setDead] = useState<boolean>(false);

        const doFetch = async (): Promise<void> => {
            setLoading(true);
            try {
                const res = await dbInstance().all();
                if (Array.isArray(res)) {
                    setFrame(res as Record<string, any>[]);
                }
            } catch (error) {
                setError(error);
            }
            setLoading(false);
        }

        useEffect(() => {
            let isAlive = true;
            if (!dead) {
                const _instanceTableName: string = (dbInstance() as any)._tableName;
                (unsubscribe as any)("true");

                const _listener = dbEventListener((status?: DB_STATUS, queryType?: string, executeCount?: EXECUTE_COUNT, tableName?: string | null, returned?: any) => {
                    if (!isAlive) {
                        return;
                    }
                    log(_instanceTableName, status, queryType, executeCount, tableName)
                    if ((tableName === null && _instanceTableName === "untable") || tableName === _instanceTableName) {
                        if (status === DB_STATUS.SUCCESS && queryType !== "select") {
                            if (typeof returned === "number" && returned > 0) {
                                doFetch();
                            } else if (Array.isArray(returned) && typeof returned[0] === "number" && returned[0] > 0) {
                                doFetch();
                            }
                        }
                    }
                });

                setUnsubscribe(() => (stayAlive?: string) => {
                    _listener();
                    stayAlive !== "true" && setDead(true);
                });

                doFetch();
            }
            return () => { isAlive = false; }
        }, deps || []);

        return {
            frame,
            unsubscribe,
            error,
            manualFetch: doFetch,
            loading
        };
    };

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
        getUserAttributes,
        resetUserPassword,
        onSignIn,
        db,
        dbEventListener,
        e,
        useReturn,
        forgotPassword,
        forgotPasswordConfirm,
        userID
    }

    return (
        <EasybaseContext.Provider value={c}>
            {mounted && children}
        </EasybaseContext.Provider>
    )
}

export default EasybaseProvider;
