export interface ConfigureFrameOptions {
    /** Edit starting index from which records will be retrieved from. Useful for paging. */
    offset?: number;
    /** Limit the amount of records to be retrieved. Can be used in combination with offset. */
    limit?: number;
    /** This object can be set to overwrite the query values as set in the integration menu. If your query is setup to find records where 'age' >= 0, passing in { age: 50 } will query where 'age' >= 50. */
    customQuery?: Record<string, unknown>;
}

export interface EasybaseProviderProps {
    /** React elements */
    children: JSX.Element[] | JSX.Element;
    /** EasyBase integration ID. Can be found by expanding the integration menu. This id is automatically generated.  */
    integrationID: string;
    /** Custom authentication string. Can be set in integration menu. If it is set, it is required to access integration. This acts as an extra layer of security and extensibility. */
    authentication?: string;
}

export interface AddRecordOptions {
    /** If true, record will be inserted at the end of the collection rather than the front. Overwrites absoluteIndex. */
    insertAtEnd?: boolean;
    /** If a record with the same ID already exists, insert a copy with a new ID */
    copyIfExists?: boolean;
    /** Values to post to EasyBase collection. Format is { column name: value } */
    newRecord: Record<string, unknown>;
    /** absolute index in collection to insert record at. Is overwritten by insertAtEnd. */
    absoluteIndex?: number;
}

// https://gist.github.com/nicbell/6081098
export const shallowCompare = (obj1: {}, obj2: {}): boolean => {
    // Loop through properties in object 1
    for (const p in obj1) {
        // Check property exists on both objects
        
        if ({}.hasOwnProperty.call(obj1, p) !== {}.hasOwnProperty.call(obj2, p)) return false;

        switch (typeof (obj1[p])) {
            // Deep compare objects
            case 'object':
                if (!shallowCompare(obj1[p], obj2[p])) return false;
                break;
            // Compare function code
            case 'function':
                if (typeof (obj2[p]) === 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) return false;
                break;
            // Compare values
            default:
                if (obj1[p] !== obj2[p]) return false;
        }
    }

    // Check object 2 for any extra properties
    for (const p in obj2) {
        if (typeof (obj1[p]) === 'undefined') return false;
    }
    return true;
}

export interface EasybaseContext {
    get: Function;
    post: Function;
    update: Function;
    Delete: Function;
}

export interface UpdateRecordAttachmentOptions {
    /** EasyBase Record to attach this attachment to. */
    record: Record<string, unknown>;
    /** The name of the column that is of type file/image/video */
    columnName: string;
    /** HTML File element containing the correct type of attachment */
    attachment: File;
}

export interface StatusResponse {
    /** Returns true if the operation was successful */
    success: boolean;
    /** Readable description of the the operation's status */
    message: string;
    /** Will represent a corresponding error if an error was thrown during the operation. */
    error?: Error;
}
