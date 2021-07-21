import Storage from './storage';

const storage = new Storage({ storageBackend: window.localStorage });

// https://github.com/sunnylqm/react-native-storage
export async function getCacheTokens(cookieName: string): Promise<Record<string, any>> {
    let cacheToken = false;
    let cacheRefreshToken = false;
    let cacheSession = false;

    try {
        cacheToken = await storage.load({ key: cookieName + "token" });
    } catch (_) {}

    try {
        cacheRefreshToken = await storage.load({ key: cookieName + "refreshToken" });
    } catch (_) {}

    try {
        cacheSession = await storage.load({ key: cookieName + "session" });
    } catch (_) {}

    return {
        cacheToken,
        cacheRefreshToken,
        cacheSession
    }
}

export async function clearCacheTokens(cookieName: string) {
    await storage.remove({ key: cookieName + "token" });
    await storage.remove({ key: cookieName + "refreshToken" });
    await storage.remove({ key: cookieName + "session" });
}

export async function setCacheTokens(g: any, cookieName: string) {
    await storage.save({
        key: cookieName + "token",
        data: g.token,
        expires: 3600 * 1000 * 24
    });

    await storage.save({
        key: cookieName + "refreshToken",
        data: g.refreshToken,
        expires: 3600 * 1000 * 24
    });

    await storage.save({
        key: cookieName + "session",
        data: g.session,
        expires: null
    });
}
