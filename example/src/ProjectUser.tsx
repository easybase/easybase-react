import React, { useState, useEffect } from "react";
import { useEasybase } from "easybase-react";
import CardElement from "./CardElement";

export default function ProjectUser() {
    
    const [usernameValue, setUsernameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    const {
        isUserSignedIn,
        signIn,
        signUp,
        signOut,
        getUserAttributes,
        Frame,
        configureFrame,
        sync,
        onSignIn
    } = useEasybase();

    const onSignUpClick = async() => {
        const res = await signUp(usernameValue, passwordValue, {
            testKey: "testValue"
        });
        console.log(res);
    }

    const onUserAttrsClick = async () => {
        const res = await getUserAttributes();
        console.log(res);
    }

    useEffect(() => {
        console.log("Mobile Apps allowed when not signed in");
        configureFrame({
            limit: 10,
            offset: 0,
            tableName: "MOBILE APPS"
        });
        sync();

        onSignIn(() => {
            console.log("Signed In!");  
            configureFrame({
                limit: 10,
                offset: 0,
                tableName: "REACT TEST"
            });
            sync()
        });
        
    }, []);

    if (isUserSignedIn()) {
        return (
            <div style={{ display: "flex", width: '100vw', height: '90vh', justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#BBB", padding: 40, borderRadius: 5 }}>
                    <button className="btn green m-4" onClick={onUserAttrsClick}><span>Get user attrs</span></button>
                    <button className="btn orange m-4" onClick={signOut}><span>Sign Out</span></button>
                </div>
                <div className="d-flex">
                    {Frame().map((ele, index) => <CardElement {...ele} index={index} key={index} />)}
                </div>
            </div>
        )
    } else {
        return (
            <div style={{ display: "flex", width: '100vw', height: '90vh', justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#BBB", padding: 40, borderRadius: 5 }}>
                    <h4>Username</h4>
                    <input style={{ fontSize: 20, marginBottom: 20 }} value={usernameValue} onChange={e => setUsernameValue(e.target.value)} />
                    <h4>Password</h4>
                    <input type="password" style={{ fontSize: 20, marginBottom: 20 }} value={passwordValue} onChange={e => setPasswordValue(e.target.value)} />
                    <button className="btn green m-4" onClick={() => signIn(usernameValue, passwordValue)}><span>Sign In</span></button>
                    <button className="btn orange m-4" onClick={onSignUpClick}><span>Sign Up</span></button>
                </div>
                <div className="d-flex">
                    {Frame().map((ele, index) => <CardElement {...ele} index={index} key={index} />)}
                </div>
            </div>
        )
    }
}