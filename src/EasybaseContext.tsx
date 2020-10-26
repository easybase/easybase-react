import { createContext } from "react";
import {
    ContextValue,
    ConfigureFrameOptions,
    StatusResponse,
    AddRecordOptions,
    UpdateRecordAttachmentOptions
} from "./utils";

const c: ContextValue = {
    configureFrame: (options: ConfigureFrameOptions) => ({}) as StatusResponse,
    addRecord: async (options: AddRecordOptions) => ({}) as StatusResponse,
    deleteRecord: async (record: Record<string, unknown>) => ({}) as StatusResponse,
    updateRecord: async (record: Record<string, unknown>) => ({}) as StatusResponse,
    sync: async () => ({}) as StatusResponse,
    updateRecordImage: async (options: UpdateRecordAttachmentOptions) => ({}) as StatusResponse,
    updateRecordVideo: async (options: UpdateRecordAttachmentOptions) => ({}) as StatusResponse,
    updateRecordFile: async (options: UpdateRecordAttachmentOptions) => ({}) as StatusResponse,
    frame: []
}

export default createContext(c);
