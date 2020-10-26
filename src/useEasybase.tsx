import { useContext } from "react";
import EasybaseContext from "./EasybaseContext";

const useEasybase = () => {
    const easybase = useContext(EasybaseContext);
    return easybase;
}

export default useEasybase;
