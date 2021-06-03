import React, { useEffect, useState, lazy, Suspense, Fragment } from 'react';
import Container from './components/Container';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { mergeDeep, defaultDictionary } from '../utils';
import { IStyles, IAuth } from '../uiTypes';
import useEasybase from '../../useEasybase';

const DefaultSignIn = lazy(() => import('./pages/SignIn'));
const DefaultSignUp = lazy(() => import('./pages/SignUp'));
const DefaultForgotPassword = lazy(() => import('./pages/ForgotPassword'));

export default function ({ theme, customStyles, children, dictionary, signUpFields }: IAuth): JSX.Element {
    const [themeVal, setThemeVal] = useState<any>({});

    const [currentPage, setCurrentPage] = useState<"SignIn" | "SignUp" | "ForgotPassword" | "ForgotPasswordConfirm">("SignIn");
    const { isUserSignedIn } = useEasybase();

    useEffect(() => {
        try {
            document.body.style.margin = "0px";
        } catch (_) { }
        async function mounted() {
            let loadedTheme: IStyles = {};
            if (theme === "minimal-dark") {
                const _theme = (await import('../themes/minimal-dark')).default;
                if (_theme.init) {
                    _theme.init()
                }
                loadedTheme = _theme;
            } else if (theme === "material") {
                const _theme = (await import('../themes/material')).default;
                if (_theme.init) {
                    _theme.init()
                }
                loadedTheme = _theme;
            } else {
                // catch all
                const _theme = (await import('../themes/minimal')).default;
                if (_theme.init) {
                    _theme.init()
                }
                loadedTheme = _theme;
            }

            if (customStyles) {
                loadedTheme = mergeDeep(loadedTheme, customStyles)
            }

            setThemeVal(loadedTheme)
        }
        mounted();
    }, [theme])

    if (isUserSignedIn()) {
        return <React.Fragment>{children}</React.Fragment>
    }

    const getCurrentPage = () => {
        switch (currentPage) {
            case "SignIn":
                return (
                    <Suspense fallback={<Fragment />}>
                        <DefaultSignIn 
                            setCurrentPage={setCurrentPage} 
                            dictionary={typeof dictionary === "object" ? { ...defaultDictionary, ...dictionary } : defaultDictionary} 
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
                        />
                    </Suspense>
                )
            case "ForgotPassword":
                return (
                    <Suspense fallback={<Fragment />}>
                        <DefaultForgotPassword 
                            setCurrentPage={setCurrentPage} 
                            dictionary={typeof dictionary === "object" ? { ...defaultDictionary, ...dictionary } : defaultDictionary} 
                        />
                    </Suspense>
                )
            default:
                return <React.Fragment />;
        }
    }

    return (
        <ThemeProvider theme={themeVal}>
            <Container>
                <Toaster toastOptions={{ style: { fontFamily: 'inherit', ...(themeVal.toast ? { ...themeVal.toast } : {}) } }} />
                {getCurrentPage()}
            </Container>
        </ThemeProvider>
    )
}
