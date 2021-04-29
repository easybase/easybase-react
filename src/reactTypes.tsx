import React from "react";
import { SQW } from "EasyQB/types/sq";

import type {
    Ebconfig,
    ConfigureFrameOptions,
    StatusResponse,
    UpdateRecordAttachmentOptions,
    FrameConfiguration,
    QueryOptions,
    AddRecordOptions,
    DeleteRecordOptions,
    DB_STATUS
} from './types';

export interface EasybaseProviderPropsOptions {
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** Log Easybase react status and events to console. */
    logging?: boolean;
}

export interface EasybaseProviderProps {
    /** React elements */
    children: JSX.Element[] | JSX.Element;
    /** Easybase ebconfig object. Can be downloaded in the integration drawer next to 'React Token'. This is automatically generated.  */
    ebconfig: Ebconfig;
    /** Optional configuration parameters. */
    options?: EasybaseProviderPropsOptions
}

export interface ContextValue {
    /**
     * Pass a callback function to run when a user signs in. This callback function will run after either successfully
     * signing in with the signIn() function OR after a user is automatically signed in via valid tokens saved to the browser from a 
     * previous instance. This is best placed with useEffect(() => {}, []);
     * @param callback callback function to run on sign in event
     */
    onSignIn(callback: () => void): void;
    /**
     * Check if a user is currently signed in.
     */
    isUserSignedIn(): boolean;
    /**
     * Sign out the current user and invalidate their cached tokens.
     */
    signOut(): void;
    /**
     * Retrieve the currently signed in users attribute object.
     * @async
     * @return {Promise<Record<string, string>>} Promise<Record<string, string>>
     */
    getUserAttributes(): Promise<Record<string, string>>;
    /**
     * Set a single attribute of the currently signed in user. Can also be updated visually in the Easybase 'Users' tab.
     * @async
     * @abstract
     * @param key Object key. Can be a new key or existing key.
     * @param value attribute value.
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    setUserAttribute(key: string, value: string): Promise<StatusResponse>;
    /**
     * Sign in a user that already exists for a project. This will save authentication tokens to a user's browser so that 
     * they will be automatically authenticated when they return to the application. These authentcation tokens will become invalid
     * when a user signs out or after 24 hours.
     * @abstract
     * @async
     * @param userID unique identifier for new user. Usually an email or phone number.
     * @param password user password.
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    signIn(userID: string, password: string): Promise<StatusResponse>;
    /**
     * Create a new user for your project. You must still call signIn() after signing up.
     * @abstract
     * @async
     * @param newUserID unique identifier for new user. Usually an email or phone number.
     * @param password user password. Must be at least 8 characters long.
     * @param userAttributes Optional object to store user attributes. Can also be edited visually in the Easybase 'Users' tab.
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    signUp(newUserID: string, password: string, userAttributes?: Record<string, string>): Promise<StatusResponse>;
    /**
     * This hook runs when the Frame changes. This can be triggered by calling sync().
     * @abstract
     * @param {React.EffectCallback} effect Callback function that executes when Frame changes.
     */
    useFrameEffect(effect: React.EffectCallback): void;
   /**
     * Configure the current frame size. Set the offset and amount of records to retreive assume you don't want to receive
     * your entire collection. This is useful for paging.
     * @abstract
     * @param {ConfigureFrameOptions} options ConfigureFrameOptions
     * @return {StatusResponse} StatusResponse
     */
    configureFrame(options: ConfigureFrameOptions): StatusResponse;
    /**
     * Manually add a record to your collection regardless of your current frame. You must call sync() after this to see updated response.
     * @abstract
     * @async
     * @param {AddRecordOptions} options AddRecordOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    addRecord(options: AddRecordOptions): Promise<StatusResponse>;
    /**
     * Manually delete a record from your collection regardless of your current frame. You must call sync() after this to see updated response.
     * @abstract
     * @async
     * @param {Record<string, any>} record 
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    deleteRecord(options: DeleteRecordOptions): Promise<StatusResponse>;
    /**
     * Call this method to syncronize your current changes with your database. Delections, additions, and changes will all be reflected by your 
     * backend after calling this method. Call Frame() after this to get a normalized array of the freshest data.
     * @abstract
     * @async
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    sync(): Promise<StatusResponse>;
    /**
     * Upload an image to your backend and attach it to a specific record. columnName must reference a column of type 'image'.
     * The file must have an extension of an image. 
     * Call sync() for fresh data with proper attachment links to cloud hosting.
     * @abstract
     * @async
     * @param {UpdateRecordAttachmentOptions} options UpdateRecordAttachmentOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecordImage(options: UpdateRecordAttachmentOptions): Promise<StatusResponse>;
    /**
     * Upload a video to your backend and attach it to a specific record. columnName must reference a column of type 'video'. 
     * The file must have an extension of a video.
     * Call sync() for fresh data with proper attachment links to cloud hosting.
     * @abstract
     * @async
     * @param {UpdateRecordAttachmentOptions} options UpdateRecordAttachmentOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecordVideo(options: UpdateRecordAttachmentOptions): Promise<StatusResponse>;
    /**
     * Upload a file to your backend and attach it to a specific record. columnName must reference a column of type 'file'. 
     * Call sync() for fresh data with proper attachment links to cloud hosting.
     * @abstract
     * @async
     * @param {UpdateRecordAttachmentOptions} options UpdateRecordAttachmentOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecordFile(options: UpdateRecordAttachmentOptions): Promise<StatusResponse>;
    /**
     * This function is how you access your current frame. This function does not get new data or push changes to Easybase. If you 
     * want to syncronize your frame and Easybase, call sync() then Frame().
     * @abstract
     * @return {Record<string, any>[]} Array of records corresponding to the current frame. Call sync() to push changes that you have made to this array.
     * 
     */
    Frame(): Record<string, any>[];
    /**
     * This function is how you access a single object your current frame. This function does not get new data or push changes to Easybase. If you 
     * want to syncronize your frame and Easybase, call sync() then Frame().
     * @abstract
     * @param {number} [index] Passing an index will only return the object at that index in your Frame, rather than the entire array. This is useful for editing single objects based on an index.
     * @return {Record<string, any>} Single record corresponding to that object within the current frame. Call sync() to push changes that you have made to this object.
     * 
     */
    Frame(index: number): Record<string, any>;
    /**
     * Gets the number of records in your table.
     * @async
     * @returns {Promise<number>} The the number of records in your table.
     */
    fullTableSize(): Promise<number>;
    /**
     * Gets the number of records in your table.
     * @async
     * @param {string} [tableName] Name of table to get the sizes of. (Projects only)
     * @returns {Promise<number>} The the number of records in your table.
     */
    fullTableSize(tableName: string): Promise<number>;
    /**
     * Retrieve an object detailing the columns in your table mapped to their corresponding type.
     * @async
     * @returns {Promise<Record<string, any>>} Object detailing the columns in your table mapped to their corresponding type.
     */
    tableTypes(): Promise<Record<string, any>>;
    /**
     * Retrieve an object detailing the columns in your table mapped to their corresponding type.
     * @async
     * @param {string} [tableName] Name of table to get the types of. (Projects only)
     * @returns {Promise<Record<string, any>>} Object detailing the columns in your table mapped to their corresponding type.
     */
    tableTypes(tableName: string): Promise<Record<string, any>>;
    /**
     * View your frames current configuration
     * @returns {Record<string, any>} Object contains the `offset` and `length` of your current frame.
     */
    currentConfiguration(): FrameConfiguration;
    /**
     * @async
     * View a query by name. This returns an isolated array that has no effect on your frame or frame configuration. sync() and Frame() have no 
     * relationship with a Query(). An edited Query cannot be synced with your database, use Frame() for realtime 
     * database array features.
     * @param {QueryOptions} options QueryOptions
     * @return {Promise<Record<string, any>[]>} Isolated array of records in the same form as Frame(). Editing this array has no effect and cannot be synced with your database. Use Frame() for realtime database features.
     */
    Query(options: QueryOptions): Promise<Record<string, any>[]>;
    /**
     * Instantiate EasyQB instance for dynamic CRUD query building: https://easybase.github.io/EasyQB/
     * @param {string} [tableName] Name of your table.
     * @param {boolean} [userAssociatedRecordsOnly] **PROJECTS ONLY** Operations will only be performed on records already associated to the currently signed-in user. Inserted records will automatically be associate to the user.
     * @returns {SQW} EasyQB object for dynamic querying: https://easybase.github.io/EasyQB/
     */
    db(tableName?: string, userAssociatedRecordsOnly?: boolean): SQW;
    /**
     * Subscribe to db events, invoked by calling `.all` or `.one`: https://easybase.github.io/EasyQB/
     * @param {function(status?: DB_STATUS, queryType?: string, queryCount?: string):void} [callback] Callback function to execute on db operations.
     * @returns {function():void} Calling this function unsubscribes your callback function from events.
     */
    dbEventListener(callback: (status?: DB_STATUS, queryType?: string, queryCount?: string) => void): () => void;
}
