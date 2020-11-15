import { Ebconfig, EasybaseProviderPropsOptions } from "./types";

namespace g {
    export let ebconfig: Ebconfig;
    export let token: {};
    export let integrationID: string;
    export let session: number;
    export let options: EasybaseProviderPropsOptions;
    export let isReactNative: boolean;
};

export default g;
