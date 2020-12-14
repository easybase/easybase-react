import Cookies from 'universal-cookie';
import { Globals } from "./types";

const cookies = new Cookies();

export function getCacheTokens(g: Globals, cookieName: string): Record<string, any> {
    if (g.instance === "React Native") {
        return {
            cacheToken: "",
            cacheRefreshToken: "",
            cacheSession: ""
        }
    } else {
        // React
        return {
            cacheToken: cookies.get(cookieName + "token"),
            cacheRefreshToken: cookies.get(cookieName + "refreshToken"),
            cacheSession: cookies.get(cookieName + "session")
        }
    }
}

export function clearCacheTokens(g: Globals, cookieName: string) {
    if (g.instance === "React Native") {

    } else {
        // React
        cookies.remove(cookieName + "token");
        cookies.remove(cookieName + "refreshToken");
        cookies.remove(cookieName + "session");
    }
}

export function setCacheTokens(g: Globals, cookieName: string) {
    if (g.instance === "React Native") {

    } else {
        // React
        cookies.set(cookieName + "token", g.token, {
            expires: new Date(Date.now() + 900000)
        });
        cookies.set(cookieName + "refreshToken", g.refreshToken, {
            expires: new Date(Date.now() + (3600 * 1000 * 24))
        });
        cookies.set(cookieName + "session", g.session, {
            expires: new Date(Date.now() + (3600 * 1000 * 24))
        });
    }
}
