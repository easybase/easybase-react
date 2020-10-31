import { createContext } from "react";
import {
    ContextValue,
    ConfigureFrameOptions,
    StatusResponse,
    AddRecordOptions,
    UpdateRecordAttachmentOptions,
    FrameConfiguration
} from "./types";

function Frame(): Record<string, any>[];
function Frame(index: number): Record<string, any>;
function Frame(index?: number): Record<string, any>[] | Record<string, any> {
    return [];
}
const c: ContextValue = {
    configureFrame: (_: ConfigureFrameOptions) => ({}) as StatusResponse,
    addRecord: async (_: AddRecordOptions) => ({}) as StatusResponse,
    deleteRecord: async (_: Record<string, any>) => ({}) as StatusResponse,
    sync: async () => ({}) as StatusResponse,
    updateRecordImage: async (_: UpdateRecordAttachmentOptions) => ({}) as StatusResponse,
    updateRecordVideo: async (_: UpdateRecordAttachmentOptions) => ({}) as StatusResponse,
    updateRecordFile: async (_: UpdateRecordAttachmentOptions) => ({}) as StatusResponse,
    Frame,
    useFrameEffect: (_: React.EffectCallback) => {},
    fullTableSize: async () => 0,
    tableTypes: async() => ({}) as Record<string, any>,
    currentConfiguration: () => ({}) as FrameConfiguration
}

export default createContext(c);
