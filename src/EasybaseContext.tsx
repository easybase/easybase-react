import { createContext } from "react";
import {
    ContextValue,
    ConfigureFrameOptions,
    StatusResponse,
    AddRecordOptions,
    UpdateRecordAttachmentOptions
} from "./types";

function Frame(): Record<string, unknown>[];
function Frame(index: number): Record<string, unknown>;
function Frame(index?: number): Record<string, unknown>[] | Record<string, unknown> {
    return [];
}
const c: ContextValue = {
    configureFrame: (_: ConfigureFrameOptions) => ({}) as StatusResponse,
    addRecord: async (_: AddRecordOptions) => ({}) as StatusResponse,
    deleteRecord: async (_: Record<string, unknown>) => ({}) as StatusResponse,
    updateRecord: async (_: Record<string, unknown>) => ({}) as StatusResponse,
    sync: async () => ({}) as StatusResponse,
    updateRecordImage: async (_: UpdateRecordAttachmentOptions) => ({}) as StatusResponse,
    updateRecordVideo: async (_: UpdateRecordAttachmentOptions) => ({}) as StatusResponse,
    updateRecordFile: async (_: UpdateRecordAttachmentOptions) => ({}) as StatusResponse,
    Frame,
    useFrameEffect: (_: React.EffectCallback) => {}
}

export default createContext(c);
