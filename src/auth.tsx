import axios from "axios";
import { POST_TYPES, AuthPostResponse } from "./types";
import g from "./g";
import { generateBareUrl, generateAuthBody } from "./utils";

export const initAuth = async (): Promise<boolean> => {
    g.session = Math.floor(100000000 + Math.random() * 900000000);

    try {
        const res = await axios.post(generateBareUrl("REACT", g.integrationID), {
            version: g.ebconfig.version,
            tt: g.ebconfig.tt,
            session: g.session
        }, { headers: { 'Eb-Post-Req': POST_TYPES.HANDSHAKE } });

        if (res.data.token) {
            g.token = res.data.token;
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const tokenPost = async (postType: POST_TYPES, body: {}): Promise<AuthPostResponse> => {
    try {
        const res = await axios.post(generateBareUrl("REACT", g.integrationID), {
            ...generateAuthBody(),
            ...body
        }, { headers: { 'Eb-Post-Req': postType } });

        if ({}.hasOwnProperty.call(res.data, 'ErrorCode') || {}.hasOwnProperty.call(res.data, 'code')) {
            if (res.data.code === "JWT EXPIRED") {
                await initAuth();
                return tokenPost(postType, body);
            }

            return {
                success: false,
                data: res.data.body
            }
        } else {
            return {
                success: res.data.success,
                data: res.data.body
            }
        }
    } catch (error) {
        return {
            success: false,
            data: error
        }
    }
}
