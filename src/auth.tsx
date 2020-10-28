import axios from "axios";
import { generateBareUrl, POST_TYPES } from "./utils";
import g from "./g";

export const initAuth = async (): Promise<boolean> => {
    try {
        const res = await axios.post(generateBareUrl("REACT", g.integrationID), {
            version: g.ebconfig.version,
            tt: g.ebconfig.tt
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

export const testToken = async (): Promise<boolean> => {
    try {
        const res = await axios.post(generateBareUrl("REACT", g.integrationID), {
            token: g.token
        }, { headers: { 'Eb-Post-Req': POST_TYPES.VALID_TOKEN } });

        if (res.data.success === true) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}
