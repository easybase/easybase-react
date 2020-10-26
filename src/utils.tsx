import React from "react";

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

export interface ContextValue {
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
     * @param {Record<string, unknown>} record Individual Record from frame
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    deleteRecord(record: Record<string, unknown>): Promise<StatusResponse>;
    /**
     * Manually update a record from your collection regardless of your current frame. You must call sync() after this to see updated response.
     * @abstract
     * @async
     * @param {Record<string, unknown>} record Individual Record from frame
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecord(record: Record<string, unknown>): Promise<StatusResponse>;
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
     * Call sync() for fresh data with propery attachment links to cloud hosting.
     * @abstract
     * @async
     * @param {UpdateRecordAttachmentOptions} options UpdateRecordAttachmentOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecordImage(options: UpdateRecordAttachmentOptions): Promise<StatusResponse>;
    /**
     * Upload a video to your backend and attach it to a specific record. columnName must reference a column of type 'video'. 
     * The file must have an extension of a video.
     * Call sync() for fresh data with propery attachment links to cloud hosting.
     * @abstract
     * @async
     * @param {UpdateRecordAttachmentOptions} options UpdateRecordAttachmentOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecordVideo(options: UpdateRecordAttachmentOptions): Promise<StatusResponse>;
    /**
     * Upload a file to your backend and attach it to a specific record. columnName must reference a column of type 'file'. 
     * Call sync() for fresh data with propery attachment links to cloud hosting.
     * @abstract
     * @async
     * @param {UpdateRecordAttachmentOptions} options UpdateRecordAttachmentOptions
     * @return {Promise<StatusResponse>} Promise<StatusResponse>
     */
    updateRecordFile(options: UpdateRecordAttachmentOptions): Promise<StatusResponse>;
    /**
     * This function is how you access your current frame. This function does not get new data or push changes to EasyBase. If you 
     * want to syncronize your frame and EasyBase, call sync() then Frame().
     * @abstract
     * @return {Record<string, unknown>[]} Array of records corresponding to the current frame. Call sync() to push changes and
     * 
     */
    Frame(): Record<string, unknown>[];
    /**
     * This hook runs when the Frame changes. This can be triggered by calling sync().
     * @param {React.EffectCallback} effect Callback function that executes when Frame changes.
     */
    useFrameEffect(effect: React.EffectCallback): void; 
}

export interface UpdateRecordAttachmentOptions {
    /** EasyBase Record to attach this attachment to. */
    record: Record<string, unknown>;
    /** The name of the column that is of type file/image/video */
    columnName: string;
    /** HTML File element containing the correct type of attachment. The file name must have a proper file extension corresponding to the attachment. */
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

export enum RECORD_REF_STATUS {
    NO_ID,
    NO_REF_WITH_ID,
    DIFFERENT_FROM_REF,
    SAME_AS_REF
}
