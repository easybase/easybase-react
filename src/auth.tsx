import axios from "axios";
import { POST_TYPES, AuthPostResponse } from "./types";
import g from "./g";
import { generateBareUrl, generateAuthBody } from "./utils";

export const initAuth = async (): Promise<boolean> => {
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

        if ({}.hasOwnProperty.call(res.data, 'ErrorCode')) {
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
