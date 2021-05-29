import React from "react";
import { SQW } from "EasyQB/types/sq";
import { NewExpression } from "EasyQB/types/expression";
import {
    EXECUTE_COUNT,
    DB_STATUS
} from "easybasejs/src/EasybaseProvider/types"

import type {
    Ebconfig,
    ConfigureFrameOptions,
    StatusResponse,
    UpdateRecordAttachmentOptions,
    FrameConfiguration,
    QueryOptions,
    AddRecordOptions,
    DeleteRecordOptions,
    EmailTemplate
} from "easybasejs/src/EasybaseProvider/types"

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

export interface UseReturnValue {
    /** Stateful frame that responds to local calls to `.update`, `.delete`, and `.set` */
    frame: Record<string, any>[];
    /** Call this function to unsubscribe to future events */
    unsubscribe(): void;
    /** Errors that occur in the useReturn workflow */
    error: any;
    /**
     * @async
     * Manually refresh the data in `frame`
     */
    manualFetch(): Promise<void>;
    /** Is the frame awaiting a response from server to be set to */
    loading: boolean;
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
     * Reset the currently signed-in user's password to a new string.
     * @async
     * @param {string} newPassword New user password
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    resetUserPassword(newPassword: string): Promise<StatusResponse>;
    /**
     * Sign in a user that already exists for a project. This will save authentication tokens to a user's browser so that 
     * they will be automatically authenticated when they return to the application. These authentication tokens will become invalid
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
     * **DEPRECATED**: Use `.db` instead - https://easybase.github.io/EasyQB/
     * 
     * This hook runs when the Frame changes. This can be triggered by calling sync().
     * @abstract
     * @param {React.EffectCallback} effect Callback function that executes when Frame changes.
     */
    useFrameEffect(effect: React.EffectCallback): void;
   /**
     * **DEPRECATED**: Use `.db` instead - https://easybase.github.io/EasyQB/
     * 
     * Configure the current frame size. Set the offset and amount of records to retrieve assume you don't want to receive
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
     * **DEPRECATED**: Use `.db` instead - https://easybase.github.io/EasyQB/
     * 
     * Call this method to synchronize your current changes with your database. Deletions, additions, and changes will all be reflected by your 
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
     * **DEPRECATED**: Use `.db` instead - https://easybase.github.io/EasyQB/
     * 
     * This function is how you access your current frame. This function does not get new data or push changes to Easybase. If you 
     * want to synchronize your frame and Easybase, call sync() then Frame().
     * @abstract
     * @return {Record<string, any>[]} Array of records corresponding to the current frame. Call sync() to push changes that you have made to this array.
     * 
     */
    Frame(): Record<string, any>[];
    /**
     * **DEPRECATED**: Use `.db` instead - https://easybase.github.io/EasyQB/
     * 
     * This function is how you access a single object your current frame. This function does not get new data or push changes to Easybase. If you 
     * want to synchronize your frame and Easybase, call sync() then Frame().
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
     * @param {function(status?: DB_STATUS, queryType?: string, executeCount?: EXECUTE_COUNT, tableName?: string | null, returned?: any):void} [callback] Callback function to execute on db operations.
     * @returns {function():void} Calling this function unsubscribes your callback function from events.
     */
    dbEventListener(callback: (status?: DB_STATUS, queryType?: string, executeCount?: EXECUTE_COUNT, tableName?: string | null, returned?: any) => void): () => void;
    /**
     * Expressions and operations builder for `.db()`, used to create complex conditions, aggregators, and clauses. https://easybase.github.io/EasyQB/docs/operations.html
     */
    e: NewExpression;
    /**
     * Custom stateful hook to an instance of `db().return`. Other local changes will automatically re-fetch the query 
     * as detailed in the passed-in db.
     * ```jsx
     * const { frame } = useReturn(db('MYTABLE').return().where(e.gt('rating', 15)).limit(10))
     * 
     * const onButtonClick = (_key) => {
     *   db('MYTABLE').delete().where({ _key }).all();
     * }
     * 
     * // Stays fresh after call to `.delete()`
     * return (<div>{ frame.map(ele => <Card {...ele} />) }</div>)
     * ```
     * @param {function():SQW} dbInstance Function returning an instance of `db().return` without having called `.all` or `.one`
     * @param {React.DependencyList} deps If present, instance will be reloaded if the values in the list change.
     * @return {UseReturnValue} Object with the required values to statefully access an array that is subscribed to local executions to the corresponding db instance.
     */
    useReturn(dbInstance: () => SQW, deps?: React.DependencyList): UseReturnValue;
    /**
     * @async
     * Trigger an email to the given username with a verification code to reset the user's password. This verification 
     * code is used in the `forgotPasswordConfirm` function, along with a new password. **The username must be the user's email address**.
     * @param {string} username A username which must also be a valid email address
     * @param {EmailTemplate} emailTemplate Optional details for the formatting & content of the verification email
     * @return {Promise<StatusResponse>} A StatusResponse corresponding to the successful sending of a verification code email
     */
    forgotPassword(username: string, emailTemplate?: EmailTemplate): Promise<StatusResponse>
    /**
     * @async
     * Confirm the resetting of an unauthenticated users password. This function is invoked after `forgotPassword` is used to trigger
     * an email containing a verification code to the given username [*which must also be an email*]. The user's randomly generated
     * verification code from their email is passed in the first parameter. 
     * @param {string} code Verification code found in the email sent from the `forgotPassword` function
     * @param {string} username The same username (email) used in the `forgotPassword` function
     * @param {string} newPassword The new password for the corresponding verified user
     * @return {Promise<StatusResponse>} A StatusResponse corresponding to the successful setting of a new password
     */
    forgotPasswordConfirm(code: string, username: string, newPassword: string): Promise<StatusResponse>
}
