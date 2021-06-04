import React, { useState, lazy, Suspense, Fragment, useEffect } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { defaultDictionary } from '../utils';
import { INativeAuth } from '../uiTypes';
import { Toast } from './components';

const { useEasybase } = require('easybase-react');

const DefaultSignIn = lazy(() => import('./pages/SignIn'));
const DefaultSignUp = lazy(() => import('./pages/SignUp'));
const DefaultForgotPassword = lazy(() => import('./pages/ForgotPassword'));

export default function ({ customStyles, children, dictionary, signUpFields }: INativeAuth): JSX.Element {
    const [currentPage, setCurrentPage] = useState<"SignIn" | "SignUp" | "ForgotPassword" | "ForgotPasswordConfirm">("SignIn");
    const [toastOpen, setToastOpen] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");

    const { isUserSignedIn } = useEasybase();

    const toast = (message: string) => {
        setToastMessage(message);
        setToastOpen(true);
    }

    useEffect(() => {
        if (toastOpen) {
            setToastOpen(false)
        }
    }, [currentPage])

    const getCurrentPage = () => {
        switch (currentPage) {
            case "SignIn":
                return (
                    <Suspense fallback={<Fragment />}>
                        <DefaultSignIn
                            setCurrentPage={setCurrentPage}
                            dictionary={typeof dictionary === "object" ? { ...defaultDictionary, ...dictionary } : defaultDictionary}
                            toast={toast}
                        />
                    </Suspense>
                )
            case "SignUp":
                return (
                    <Suspense fallback={<Fragment />}>
                        <DefaultSignUp
                            setCurrentPage={setCurrentPage}
                            dictionary={typeof dictionary === "object" ? { ...defaultDictionary, ...dictionary } : defaultDictionary}
                            signUpFields={typeof signUpFields === "object" ? signUpFields : {}}
                            toast={toast}
                        />
                    </Suspense>
                )
            case "ForgotPassword":
                return (
                    <Suspense fallback={<Fragment />}>
                        <DefaultForgotPassword
                            setCurrentPage={setCurrentPage}
                            dictionary={typeof dictionary === "object" ? { ...defaultDictionary, ...dictionary } : defaultDictionary}
                            toast={toast}
                        />
                    </Suspense>
                )
            default:
                return <React.Fragment />;
        }
    }

    if (isUserSignedIn()) {
        return <Fragment>{children}</Fragment>
    } else {
        return (
            <ThemeProvider theme={typeof customStyles === "object" ? customStyles : {}}>
                <Toast toastMessage={toastMessage} toastOpen={toastOpen} setToastOpen={setToastOpen} />
                {getCurrentPage()}
            </ThemeProvider>
        )
    }
}
