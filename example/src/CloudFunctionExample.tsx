import React, { useState } from "react";
import { callFunction } from "easybase-react";

const CloudFunctionExample = () => {

    const [funcOutput, setFuncOutput] = useState("");

    const onButtonClick = async () => {
        const res = await callFunction("d6f217bde0b6b4d2a1d9138be901e3d8-new-hello-2", { cap: "D" });
        setFuncOutput(res);
    }

    const codeRoot = {
        backgroundColor: '#272822',
        padding: 15,
        borderRadius: '0.3em',
        width: 500,
        height: 100,
        color: "white"

    }

    return (
        <div className="d-flex align-items-center">
            <button className="btn green m-4 p-4" onClick={onButtonClick}><span>Run Function</span></button>
            <code style={codeRoot}>{funcOutput}</code>
        </div>
    )
}

export default CloudFunctionExample;