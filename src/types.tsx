export interface ConfigureFrameOptions {
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset?: number;
    /** Limit the amount of records to be retrieved. Set to -1 or null to return all records. Can be used in combination with offset. */
    limit?: number | null;
    /** Table to sync frame with. (Projects only) */
    tableName?: string;
}

export interface EasybaseProviderPropsOptions {
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
    /** Log Easybase react status and events to console. */
    logging?: boolean;
}

export interface EasybaseProviderProps {
    /** Easybase ebconfig object. Can be downloaded in the integration drawer next to 'React Token'. This is automatically generated.  */
    ebconfig: Ebconfig;
    /** Optional configuration parameters. */
    options?: EasybaseProviderPropsOptions
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
    /** Values to post to Easybase collection. Format is { column name: value } */
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
    /** Easybase Record to attach this attachment to */
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
    error?: Error;
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
    EASY_QB = "easyqb"
}

export enum DB_STATUS {
    ERROR = "error",
    PENDING = "pending",
    SUCCESS = "success"
}

export interface AuthPostResponse {
    success: boolean;
    data: any;
}

export interface Globals {
    ebconfig: Ebconfig;
    token: string;
    refreshToken: string;
    integrationID: string;
    session: number;
    options: EasybaseProviderPropsOptions;
    instance: string;
    mounted: boolean;
    newTokenCallback(): void;
}
