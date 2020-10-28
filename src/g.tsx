import { Ebconfig } from "./types";

namespace g {
    export let ebconfig: Ebconfig;
    export let token: {};
    export let integrationID: string;
    export const session: number = Math.floor(100000000 + Math.random() * 900000000);
};

export default g;
