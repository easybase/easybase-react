import { Ebconfig, EasybaseProviderPropsOptions, Globals } from "./types";

namespace GlobalNamespace {
    export let ebconfig: Ebconfig;
    export let token: {};
    export let integrationID: string;
    export let session: number;
    export let options: EasybaseProviderPropsOptions;
    export let isReactNative: boolean;
};

const _g: Globals = { ...GlobalNamespace };

export default _g;
 
export function gFactory(): Globals {
    return { ...GlobalNamespace } as Globals;
}
