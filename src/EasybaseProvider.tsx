import React from "react";
import axios from "axios";
import EasybaseContext from "./EasybaseContext";
import {
    ConfigureFrameOptions,
    EasybaseProviderProps,
    AddRecordOptions,
    shallowCompare,
    UpdateRecordAttachmentOptions,
    StatusResponse
} from "./utils";
import fileReaderStream from "./frs";

const generateBareUrl = (type: string, integrationID: string): string => `https://api.easybase.io/${type}/${integrationID}`;

const _symb = Symbol("_id");

const EasybaseProvider = ({ children, integrationID }: EasybaseProviderProps) => {
    const _frame: any[] = [];
    const _frameCopy: any[] = [];
    let _isInitialized: boolean = false;
    let _frameConfiguration: ConfigureFrameOptions = {
        offset: 0,
        limit: undefined,
        customQuery: undefined
    };

    const frame = (): Record<string, unknown>[] => _frame;

    const configureFrame = (options: ConfigureFrameOptions): StatusResponse => {
        _frameConfiguration = { ..._frameConfiguration, ...options };
        _isInitialized = false;
        return {
            message: "Successfully configured frame. Run sync() for changes to be shown in frame()",
            success: true
        }
    }

    const addRecord = async (options: AddRecordOptions): Promise<StatusResponse> => {
        const defaultValues: AddRecordOptions = {
            insertAtEnd: undefined,
            copyIfExists: undefined,
            newRecord: {}
        }

        const { insertAtEnd, copyIfExists, newRecord }: AddRecordOptions = { ...defaultValues, ...options };

        let errStr: string;

        try {
            const res = await axios.post(generateBareUrl("REACT", integrationID), {
                _config: {
                    type: "addRecord",
                    insertAtEnd,
                    copyIfExists,
                    newRecord
                }
            });
            if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) {
                console.error(res.data.message);
                errStr = res.data.message;
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

        return {
            message: "Easybase Error: addRecord failed " + errStr,
            success: false,
            error: new Error(errStr)
        };
    }

    const deleteRecord = async (record: Record<string, unknown> | {}): Promise<string> => {
        let errStr: string;
        try {
            const res = await axios.post(generateBareUrl("REACT", integrationID), {
                _config: {
                    type: "deleteRecord",
                    id: record[_symb]
                }
            });
            if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) {
                console.error(res.data.message);
            }
            return res.data.message;
        } catch (err) {
            console.error("Easybase Error: addRecord failed ", err);
            errStr = err;
        }
        return errStr;
    }

    const updateRecord = async (record: Record<string, unknown> | {}): Promise<StatusResponse> => {
        let errStr: string;
        try {
            const res = await axios.post(generateBareUrl("REACT", integrationID), {
                _config: {
                    type: "deleteRecord",
                    id: record[_symb],
                    values: record
                }
            });
            if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) {
                console.error(res.data.message);
                errStr = res.data.message;
            } else {
                return {
                    message: res.data.message,
                    success: true
                }
            }
        } catch (err) {
            console.error("Easybase Error: addRecord failed ", err);
            errStr = err;
            return {
                message: "Easybase Error: addRecord failed " + err,
                success: false,
                error: err
            }
        }
        return {
            success: false,
            message: errStr,
            error: new Error(errStr)
        };
    }

    // Only allow the deletion of one element at a time
    const sync = async (): Promise<StatusResponse> => {

        const _setFrame = (newData: Record<string, unknown>[]) => {
            _frame.length = newData.length;
            _frameCopy.length = newData.length;

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
                _frameCopy[i] = copyEle;
            }
        }

        const { offset, limit, customQuery }: ConfigureFrameOptions = _frameConfiguration;

        if (_isInitialized) {
            // Check to see if any element were delete (Only 1)
            for (const referenceEle of _frameCopy) {
                if (!_frame.some(ele => ele[_symb] === referenceEle[_symb])) {
                    await deleteRecord(referenceEle);
                    break;
                }
            }

            // Check to see if any elements were added or updated
            for (let i = 0; i < _frame.length; i++) {
                const currEle = _frame[i];

                if (currEle[_symb] === undefined) {
                    await addRecord({
                        newRecord: currEle,
                        absoluteIndex: i + offset!
                    });
                } else {
                    const referenceEle = _frameCopy.find(ele => ele[_symb] === currEle[_symb]);
                    if (referenceEle !== undefined && !shallowCompare(currEle, referenceEle)) {
                        await updateRecord(currEle)
                    }
                }
            }
        }

        let returnStr: string;

        try {
            const res = await axios.post(generateBareUrl("REACT", integrationID), {
                _config: {
                    type: "get",
                    offset,
                    limit,
                    customQuery
                }
            });

            if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) {
                console.error(res.data.message);
                returnStr = res.data.message;
            } else {
                _isInitialized = true;
                _setFrame(res.data);
                return 'Success. Call frame() for data';
            }
        } catch (err) {
            console.error("Easybase Error: get failed ", err);
            returnStr = `${err}`;
        }

        return returnStr;
    }

    const updateRecordImage = async (options: UpdateRecordAttachmentOptions): Promise<StatusResponse> => {

    }

    const updateRecordVideo = async (options: UpdateRecordAttachmentOptions): Promise<StatusResponse> => {

    }
    const updateRecordFile = async (options: UpdateRecordAttachmentOptions): Promise<StatusResponse> => {

    }

    const _updateRecordAttachment = async (options: UpdateRecordAttachmentOptions, type: string) => {
        const stream = fileReaderStream(file, {});
        const formData = new FormData();
        formData.append('file', stream);
        
        const res = await axios({
            method: 'POST',
            url: 'https://api.easybase.io/something',
            headers: {
                'content-type': 'multipart/form-data'
            },
            data: formData
        });
    }

    return (
        <EasybaseContext.Provider value={{ get }}>
            {children}
        </EasybaseContext.Provider>
    )
}

export default EasybaseProvider;
