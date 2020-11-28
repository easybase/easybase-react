import { createContext } from "react";
import {
    ContextValue
} from "./reactTypes";
import {
    ConfigureFrameOptions,
    StatusResponse,
    AddRecordOptions,
    UpdateRecordAttachmentOptions,
    FrameConfiguration,
    QueryOptions
} from "../node_modules/easybasejs/src/EasybaseProvider/types";

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
    currentConfiguration: () => ({}) as FrameConfiguration,
    Query: async (_: QueryOptions) => ([]),
    getUserAttributes: async() => ({}) as Record<string, string>,
    isUserSignedIn: () => false,
    setUserAttribute: async (_: string, _2: string) => ({}) as StatusResponse,
    signIn: async (_: string, _2: string) => ({}) as StatusResponse,
    signOut: () => {},
    signUp: async (_: string, _2: string, _3?: Record<string, string>) => ({}) as StatusResponse,
    onSignIn: (_: () => void) => {}
}

export default createContext(c);
