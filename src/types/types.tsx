/* eslint-disable camelcase */
import React from "react";
import { SQW } from "easyqb/types/sq";
import { NewExpression } from "easyqb/types/expression";

export interface GoogleAnalyticsEvents {
    login?: boolean;
    sign_up?: boolean;
    forgot_password?: boolean;
    forgot_password_confirm?: boolean;
    reset_user_password?: boolean;
    get_user_attributes?: boolean;
    set_user_attribute?: boolean;
    query?: boolean;
    full_table_size?: boolean;
    table_types?: boolean;
    db_one?: boolean;
    db_all?: boolean;
}

export interface EasybaseProviderPropsOptions {
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** Log Easybase react status and events to console. */
    logging?: boolean;
    /** Google Analytics 4 Measurement ID for activity reporting */
    googleAnalyticsId?: string;
    /** **Only Required for React Native** – Google Analytics 4 Measurement Protocol Secret ID for activity reporting. To create a new secret, navigate in the Google Analytics UI to: Admin > Data Streams > choose your stream > Measurement Protocol > Create */
    googleAnalyticsSecret?: string;
    /**
     * Specify which extra events are tracked in Google Analytics
     * 
     * **default**:
     *  * Page Mount
     *  * login
     *  * sign_up
     *  * forgot_password
     *  * forgot_password_confirm
     *  * reset_user_password
     *  
    */
    googleAnalyticsEventTracking?: GoogleAnalyticsEvents;
}

export interface EasybaseProviderProps {
    /** React elements */
    children: JSX.Element[] | JSX.Element;
    /** Easybase ebconfig object. Can be downloaded in the integration drawer next to 'React Token'. This is automatically generated.  */
    ebconfig: Ebconfig;
    /** Optional configuration parameters. */
    options?: EasybaseProviderPropsOptions
}

export interface UseReturnValue<T> {
    /** Stateful frame that responds to local calls to `.update`, `.delete`, and `.set` */
    frame: T[];
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
     * @return {boolean} Is a user signed in.
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
     * @param key Object key. Can be a new key or existing key.
     * @param value attribute value.
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    setUserAttribute(key: string, value: string): Promise<StatusResponse>;
    /**
     * Reset the currently signed-in user's password to a new string.
     * @async
     * @param {string} currentPassword Signed-in user's current password
     * @param {string} newPassword New password for user's account
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    resetUserPassword(currentPassword: string, newPassword: string): Promise<StatusResponse>;
    /**
     * Sign in a user that already exists for a project. This will save authentication tokens to a user's browser so that 
     * they will be automatically authenticated when they return to the application. These authentication tokens will become invalid
     * when a user signs out or after 24 hours.
     * @async
     * @param userID unique identifier for new user. Usually an email or phone number.
     * @param password user password.
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    signIn(userID: string, password: string): Promise<StatusResponse>;
    /**
     * Create a new user for your project. You must still call signIn() after signing up.
     * @async
     * @param newUserID unique identifier for new user. Usually an email or phone number.
     * @param password user password. Must be at least 8 characters long.
     * @param userAttributes Optional object to store user attributes. Can also be edited visually in the Easybase 'Users' tab.
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    signUp(newUserID: string, password: string, userAttributes?: Record<string, string>): Promise<StatusResponse>;
    /**
     * **DEPRECATED**: Use `db` instead - https://easybase.github.io/EasyQB/
     * 
     * This hook runs when the Frame changes. This can be triggered by calling sync().
     * @param {React.EffectCallback} effect Callback function that executes when Frame changes.
     */
    useFrameEffect(effect: React.EffectCallback): void;
    /**
     * **DEPRECATED**: Use `db` instead - https://easybase.github.io/EasyQB/
     * @deprecated Use `db` instead - https://easybase.github.io/EasyQB/
     * @param {ConfigureFrameOptions} options ConfigureFrameOptions
     * @return {StatusResponse} StatusResponse
     */
    configureFrame(options: ConfigureFrameOptions): StatusResponse;
    /**
     * **DEPRECATED**: Use `db().insert()` instead - https://easybase.github.io/EasyQB/docs/insert_queries.html
     * @deprecated Use `db().insert()` instead - https://easybase.github.io/EasyQB/docs/insert_queries.html
     * @async
     * @param {AddRecordOptions} options AddRecordOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    addRecord(options: AddRecordOptions): Promise<StatusResponse>;
    /**
     * **DEPRECATED**: Use `db().delete()` instead - https://easybase.github.io/EasyQB/docs/delete_queries.html
     * @deprecated Use `db().delete()` instead - https://easybase.github.io/EasyQB/docs/delete_queries.html
     * @async
     * @param {Record<string, any>} record 
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    deleteRecord(options: DeleteRecordOptions): Promise<StatusResponse>;
    /**
     * **DEPRECATED**: Use `db` instead - https://easybase.github.io/EasyQB/
     * @deprecated Use `db` instead - https://easybase.github.io/EasyQB/
     * @async
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    sync(): Promise<StatusResponse>;
    /**
     * **DEPRECATED**: Use the `setImage` function instead.
     * @deprecated Use the `setImage` function instead.
     * @async
     * @param {UpdateRecordAttachmentOptions} options UpdateRecordAttachmentOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecordImage(options: UpdateRecordAttachmentOptions): Promise<StatusResponse>;
    /**
     * **DEPRECATED**: Use the `setVideo` function instead.
     * @deprecated Use the `setVideo` function instead.
     * @async
     * @param {UpdateRecordAttachmentOptions} options UpdateRecordAttachmentOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecordVideo(options: UpdateRecordAttachmentOptions): Promise<StatusResponse>;
    /**
     * **DEPRECATED**: Use the `setFile` function instead.
     * @deprecated Use the `setFile` function instead.
     * @async
     * @param {UpdateRecordAttachmentOptions} options UpdateRecordAttachmentOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecordFile(options: UpdateRecordAttachmentOptions): Promise<StatusResponse>;
    /**
     * Upload an image to your backend and attach it to a specific record. columnName must reference a column of type 'image'.
     * The file must have a valid image extension (png, jpg, heic, etc). 
     * @async
     * @param {string} recordKey The '_key' of the record to attach this image to. Can be retrieved like: `db().return("_key").where({ title: "The Lion King" }).one()`
     * @param {string} columnName The name of the column that is of type image to attach.
     * @param {File | FileFromURI} image Either an HTML File element or a FileFromURI object for React Native instances. For React Native, use libraries such as react-native-image-picker and react-native-document-picker. The file name must have a valid image file extension.
     * @param {string} [tableName] Table to post attachment to. (Projects only)
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    setImage(recordKey: string, columnName: string, image: File | FileFromURI, tableName?: string): Promise<StatusResponse>;
    /**
     * Upload a video to your backend and attach it to a specific record. columnName must reference a column of type 'video'.
     * The file must have a valid video extension (webm, mp4, mov, etc). 
     * @async
     * @param {string} recordKey The '_key' of the record to attach this image to. Can be retrieved like: `db().return("_key").where({ title: "The Lion King" }).one()`
     * @param {string} columnName The name of the column that is of type video to attach.
     * @param {File | FileFromURI} video Either an HTML File element or a FileFromURI object for React Native instances. For React Native, use libraries such as react-native-image-picker and react-native-document-picker. The file name must have a valid video file extension.
     * @param {string} [tableName] Table to post attachment to. (Projects only)
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    setVideo(recordKey: string, columnName: string, video: File | FileFromURI, tableName?: string): Promise<StatusResponse>;
    /**
     * Upload a file to your backend and attach it to a specific record. columnName must reference a column of type 'file'.
     * @async
     * @param {string} recordKey The '_key' of the record to attach this image to. Can be retrieved like: `db().return("_key").where({ title: "The Lion King" }).one()`
     * @param {string} columnName The name of the column that is of type file to attach.
     * @param {File | FileFromURI} file Either an HTML File element or a FileFromURI object for React Native instances. For React Native, use libraries such as react-native-image-picker and react-native-document-picker.
     * @param {string} [tableName] Table to post attachment to. (Projects only)
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    setFile(recordKey: string, columnName: string, file: File | FileFromURI, tableName?: string): Promise<StatusResponse>;
    /**
     * **DEPRECATED**: Use `db` instead - https://easybase.github.io/EasyQB/
     * @deprecated Use `db` instead - https://easybase.github.io/EasyQB/
     * @return {Record<string, any>[]} Array of records corresponding to the current frame. Call sync() to push changes that you have made to this array.
     */
    Frame(): Record<string, any>[];
    /**
     * **DEPRECATED**: Use `db` instead - https://easybase.github.io/EasyQB/
     * @deprecated Use `db` instead - https://easybase.github.io/EasyQB/
     * @param {number} [index] Passing an index will only return the object at that index in your Frame, rather than the entire array. This is useful for editing single objects based on an index.
     * @return {Record<string, any>} Single record corresponding to that object within the current frame. Call sync() to push changes that you have made to this object.
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
     * 
     * ```
     * 
     * const { frame } = useReturn(() => db('MYTABLE').return().where(e.gt('rating', ratingState)).limit(10), [ratingState])
     * 
     * const onButtonClick = (_key) => {
     *   db('MYTABLE').delete().where({ _key }).all();
     * }
     * 
     * // Stays fresh after call to `.delete()`
     * return (<div>{ frame.map(ele => <Card {...ele} />) }</div>)
     * 
     * ```
     * 
     * @param {function():SQW} dbInstance Function returning an instance of `db().return` without having called `.all` or `.one`
     * @param {React.DependencyList} deps If present, instance will be reloaded if the values in the list change.
     * @return {UseReturnValue} Object with the required values to statefully access an array that is subscribed to local executions to the corresponding db instance.
     */
    useReturn<T = Record<string, any>>(dbInstance: () => SQW, deps?: React.DependencyList): UseReturnValue<T>;
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
    /**
     * Retrieve the currently signed-in user's ID.
     * @return {string | undefined} The currently signed-in user's ID (username), otherwise undefined.
     */
    userID(): string | undefined;
}

/**
 * JS TYPES: ++++++++++++++++++
 */

export interface ConfigureFrameOptions {
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset?: number;
    /** Limit the amount of records to be retrieved. Set to -1 or null to return all records. Can be used in combination with offset. */
    limit?: number | null;
    /** Table to sync frame with. (Projects only) */
    tableName?: string;
}

export interface FrameConfiguration {
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset: number;
    /** Limit the amount of records to be retrieved. Set to -1 or null to return all records. Can be used in combination with offset. */
    limit: number | null;
    /** Table to sync frame with. (Projects only) */
    tableName?: string;
}

export interface Ebconfig {
    tt?: string,
    integration: string,
    version: string
}

export interface AddRecordOptions {
    /** If true, record will be inserted at the end of the collection rather than the front. Overwrites absoluteIndex. */
    insertAtEnd?: boolean;
    /** Values to post to EasyBase collection. Format is { column name: value } */
    newRecord: Record<string, any>;
    /** Table to post new record to. (Projects only) */
    tableName?: string;
}

export interface DeleteRecordOptions {
    record: Record<string, any>;
    /** Table to delete record from. (Projects only) */
    tableName?: string;
}

export interface QueryOptions {
    /** Name of the query saved in Easybase's Visual Query Builder */
    queryName: string;
    /** If you would like to sort the order of your query by a column. Pass the name of that column here */
    sortBy?: string;
    /** By default, columnToSortBy will sort your query by ascending value (1, 2, 3...). To sort by descending set this to true */
    descending?: boolean;
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset?: number;
    /** Limit the amount of records to be retrieved. Can be used in combination with offset. */
    limit?: number;
    /** This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50. Read more: https://easybase.io/about/2020/09/15/Customizing-query-values/ */
    customQuery?: Record<string, any>;
    /** Table to query. (Projects only) */
    tableName?: string;
}

export interface FileFromURI {
    /** Path on local device to the attachment. Usually received from react-native-image-picker or react-native-document-picker */
    uri: string,
    /** Name of the file with proper extension */
    name: string,
    /** File MIME type */
    type: string
}

export interface UpdateRecordAttachmentOptions {
    /** EasyBase Record to attach this attachment to */
    record: Record<string, any>;
    /** The name of the column that is of type file/image/video */
    columnName: string;
    /** Either an HTML File element containing the correct type of attachment or a FileFromURI object for React Native instances.
     * For React Native use libraries such as react-native-image-picker and react-native-document-picker.
     * The file name must have a proper file extension corresponding to the attachment. 
     */
    attachment: File | FileFromURI;
    /** Table to post attachment to. (Projects only) */
    tableName?: string;
}

export interface StatusResponse {
    /** Returns true if the operation was successful */
    success: boolean;
    /** Readable description of the the operation's status */
    message: string;
    /** Will represent a corresponding error if an error was thrown during the operation. */
    errorCode?: string;
}

export interface EmailTemplate {
    /** Optional header of email that will be sent to user with verification code */
    greeting?: string;
    /** Optional name of application for placement within email */
    appName?: string;
    /** Optional footer of verification email often used for disclaimers. Can be a valid HTML string */
    footer?: string;
}

export enum POST_TYPES {
    UPLOAD_ATTACHMENT = "upload_attachment",
    HANDSHAKE = "handshake",
    VALID_TOKEN = "valid_token",
    GET_FRAME = "get_frame",
    TABLE_SIZE = "table_size",
    COLUMN_TYPES = "column_types",
    SYNC_STACK = "sync_stack",
    SYNC_DELETE = "sync_delete",
    SYNC_INSERT = "sync_insert",
    GET_QUERY = "get_query",
    USER_ATTRIBUTES = "user_attributes",
    SET_ATTRIBUTE = "set_attribute",
    SIGN_UP = "sign_up",
    REQUEST_TOKEN = "request_token",
    EASY_QB = "easyqb",
    RESET_PASSWORD = "reset_password",
    FORGOT_PASSWORD_SEND = "forgot_password_send",
    FORGOT_PASSWORD_CONFIRM = "forgot_password_confirm"
}

export enum DB_STATUS {
    ERROR = "error",
    PENDING = "pending",
    SUCCESS = "success"
}

export enum EXECUTE_COUNT {
    ALL = "all",
    ONE = "one"
}

export interface AuthPostResponse {
    success: boolean;
    data: any;
}

export interface Globals {
    ebconfig: Ebconfig;
    token: string;
    refreshToken: string;
    session: number;
    options: EasybaseProviderPropsOptions;
    instance: "Node" | "React" | "React Native";
    mounted: boolean;
    newTokenCallback(): void;
    userID: string | undefined;
    analyticsEnabled: boolean;
    analyticsEventsToTrack: GoogleAnalyticsEvents;
    analyticsEvent(eventTitle: string, params?: Record<string, any>): void;
    analyticsIdentify(hashedUserId: string): void;
    GA_USER_ID_SALT: string; // https://support.google.com/analytics/answer/6366371?hl=en#hashed
}
