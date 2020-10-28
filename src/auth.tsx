import axios from "axios";
import { generateBareUrl, Ebconfig } from "./utils";

export const initAuth = async (ebconfig: Ebconfig): Promise<any> => {
    try {
        const res = await axios.post(generateBareUrl("REACT", ebconfig.integration), { version: ebconfig.version, tt: ebconfig.tt }, {
            headers: {
                postType: "handshake"
            }
        });

        console.log(res);
        return res.data;
    } catch (error) {
        console.log(error);
        return {};
    }
}
