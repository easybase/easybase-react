import g from "./g";

export const generateBareUrl = (type: string, integrationID: string): string => `https://api.easybase.io/${type}/${integrationID}`;

export const generateAuthBody = (): any => {
    const stamp = Date.now();
    return {
        token: g.token,
        token_time: ~~(g.session / (stamp % 64)),
        now: stamp
    }
}

export function log(...params: any): void {
    if (g.options.logging) {
        console.log("EASYBASE — ", ...params);
    }
}
