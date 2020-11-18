import _g from "./g";

export default function utilsFactory(globals?: any): any {
    const g = globals || _g;

    const generateBareUrl = (type: string, integrationID: string): string => `https://api.easybase.io/${type}/${integrationID}`;

    const generateAuthBody = (): any => {
        const stamp = Date.now();
        return {
            token: g.token,
            token_time: ~~(g.session / (stamp % 64)),
            now: stamp
        }
    }
    
    function log(...params: any): void {
        if (g.options.logging) {
            console.log("EASYBASE — ", ...params);
        }
    }

    return {
        generateAuthBody,
        generateBareUrl,
        log
    }
}
