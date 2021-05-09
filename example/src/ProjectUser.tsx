import React, { useState, useEffect } from "react";
import { useEasybase } from "easybase-react";
import DbCardElement from "./DbCardElement";

export default function ProjectUser() {
    
    const [usernameValue, setUsernameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [data, setData] = useState<Record<string, any>[]>([]);

    const {
        isUserSignedIn,
        signIn,
        signUp,
        signOut,
        getUserAttributes,
        resetUserPassword,
        onSignIn,
        db
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
        db('MOBILE APPS').return().limit(10).all().then(res => {
            setData(res as Record<string, any>[]);
        });

        onSignIn(() => {
            console.log("Signed In!");  
            db('REACT TEST', true).return().limit(10).all().then(res => {
                setData(res as Record<string, any>[]);
            });
        });
        
    }, []);

    const addUserRecord = async () => {
        await db('REACT TEST', true).insert({rating: 68, app_name: "this is only for this user"}).one();
        const res = await db('REACT TEST', true).return().limit(10).all();
        setData(res as Record<string, any>[]);
    }

    const resetPassword = async () => {
        const new_pass = prompt("Enter new password", "");
        if (!new_pass) return;
        console.log(await resetUserPassword(new_pass));
        signOut();
    }

    if (isUserSignedIn()) {
        return (
            <div style={{ display: "flex", width: '100vw', height: '90vh', justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#BBB", padding: 40, borderRadius: 5 }}>
                    <button className="btn green m-4" onClick={onUserAttrsClick}><span>Get user attrs</span></button>
                    <button className="btn orange m-4" onClick={signOut}><span>Sign Out</span></button>
                    <button className="btn orange m-4" onClick={addUserRecord}><span>Add User Record</span></button>
                    <button className="btn orange m-4" onClick={resetPassword}><span>Reset Password</span></button>
                </div>
                <div className="d-flex">
                    {data.map((ele, index) => <DbCardElement {...ele} tableName="REACT TEST" key={index} />)}
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
                    {data.map((ele, index) => <DbCardElement {...ele} tableName="MOBILE APPS" key={index} />)}
                </div>
            </div>
        )
    }
}