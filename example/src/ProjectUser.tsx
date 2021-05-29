import React, { useState, useEffect } from "react";
import { useEasybase } from "easybase-react";
import DbCardElement from "./DbCardElement";
import { Modal, Button, Form } from 'semantic-ui-react'

export default function ProjectUser() {

    const [usernameValue, setUsernameValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [data, setData] = useState<Record<string, any>[]>([]);

    const [forgotDialogOpen, setForgotDialogOpen] = useState<boolean>(false);
    const [forgotDialogStep, setForgotDialogStep] = useState(0);
    const [forgotUsernameVal, setForgotUsernameVal] = useState("");
    const [forgotNewPassVal, setForgotNewPassVal] = useState("");
    const [forgotCodeVal, setForgotCodeVal] = useState("");

    const {
        isUserSignedIn,
        signIn,
        signUp,
        signOut,
        getUserAttributes,
        resetUserPassword,
        onSignIn,
        db,
        forgotPassword,
        forgotPasswordConfirm
    } = useEasybase();

    const onSignUpClick = async () => {
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
        await db('REACT TEST', true).insert({ rating: 68, app_name: "this is only for this user" }).one();
        const res = await db('REACT TEST', true).return().limit(10).all();
        setData(res as Record<string, any>[]);
    }

    const resetPassword = async () => {
        const new_pass = prompt("Enter new password", "");
        if (!new_pass) return;
        console.log(await resetUserPassword(new_pass));
        signOut();
    }

    const onForgotSubmit = async () => {
        switch (forgotDialogStep) {
            case 0:
                if (forgotUsernameVal) {
                    await forgotPassword(forgotUsernameVal, { appName: "My React Test" })
                    setForgotDialogStep(1);
                }
                break;
            case 1:
                if (forgotCodeVal && forgotNewPassVal) {
                    await forgotPasswordConfirm(forgotCodeVal, forgotUsernameVal, forgotNewPassVal)
                    setForgotCodeVal("")
                    setForgotNewPassVal("")
                    setForgotUsernameVal("")
                    setForgotDialogStep(0)
                    setForgotDialogOpen(false)
                }
                break;
            default:
                break;
        }
    }

    const handleSignIn = async () => {
        const res = await signIn(usernameValue, passwordValue)
        console.log(res)
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
                    <button className="btn green m-4" onClick={handleSignIn}><span>Sign In</span></button>
                    <button className="btn orange m-4" onClick={onSignUpClick}><span>Sign Up</span></button>
                    <a href="javascript:void(0)" style={{ textAlign: "end" }} onClick={_ => setForgotDialogOpen(true)}><small>Forgot Password</small></a>
                </div>
                <div className="d-flex">
                    {data.map((ele, index) => <DbCardElement {...ele} tableName="MOBILE APPS" key={index} />)}
                </div>
                <Modal open={forgotDialogOpen} onClose={_ => setForgotDialogOpen(false)}>
                    <Modal.Content>
                        <Form onSubmit={onForgotSubmit}>
                            {forgotDialogStep === 0 &&
                                <Form.Field>
                                    <label>Username (email)</label>
                                    <input value={forgotUsernameVal} onChange={e => setForgotUsernameVal(e.target.value)} />
                                </Form.Field>
                            }
                            {forgotDialogStep === 1 &&
                                <>
                                    <Form.Field>
                                        <label>Code</label>
                                        <input value={forgotCodeVal} onChange={e => setForgotCodeVal(e.target.value)} />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>New Password</label>
                                        <input value={forgotNewPassVal} onChange={e => setForgotNewPassVal(e.target.value)} />
                                    </Form.Field>
                                </>
                            }
                            <Button type='submit'>Submit</Button>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={() => setForgotDialogOpen(false)}>
                            Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}