import storage from './native-storage/storage.native';
import { Globals } from "../types";

export function getCacheTokens(cookieName: string): Record<string, any> {
    return {
        cacheToken: storage.getItem(cookieName + "token"),
        cacheRefreshToken: storage.getItem(cookieName + "refreshToken"),
        cacheSession: storage.getItem(cookieName + "session")
    }
}

export function clearCacheTokens(cookieName: string) {
    storage.removeItem(cookieName + "token");
    storage.removeItem(cookieName + "refreshToken");
    storage.removeItem(cookieName + "session");
}

export function setCacheTokens(g: Globals, cookieName: string) {
    storage.setItem(cookieName + "token", g.token);
    storage.setItem(cookieName + "refreshToken", g.refreshToken);
    storage.setItem(cookieName + "session", g.session);
}
