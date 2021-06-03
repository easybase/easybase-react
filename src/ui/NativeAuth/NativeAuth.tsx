import React, { useEffect, useState, lazy, Suspense, Fragment } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { mergeDeep, defaultDictionary } from '../utils';
import { IStyles, IAuth } from '../uiTypes';
import useEasybase from '../../useEasybase';

const DefaultSignIn = lazy(() => import('./pages/SignIn'));
// const DefaultSignUp = lazy(() => import('./pages/SignUp'));
// const DefaultForgotPassword = lazy(() => import('./pages/ForgotPassword'));

export default function ({ theme, customStyles, children, dictionary, signUpFields }: IAuth): JSX.Element {
    const [themeVal, setThemeVal] = useState<any>({});

    const [currentPage, setCurrentPage] = useState<"SignIn" | "SignUp" | "ForgotPassword" | "ForgotPasswordConfirm">("SignIn");
    const { isUserSignedIn } = useEasybase();

    useEffect(() => {
        async function mounted() {
            let loadedTheme: IStyles = {};
            // TODO: allow RN themes
            // if (theme === "minimal-dark") {
            //     const _theme = (await import('../themes/minimal-dark')).default;
            //     loadedTheme = _theme;
            // } else if (theme === "material") {
            //     const _theme = (await import('../themes/material')).default;
            //     loadedTheme = _theme;
            // } else {
            //     // catch all
            //     const _theme = (await import('../themes/minimal')).default;
            //     loadedTheme = _theme;
            // }

            if (customStyles) {
                loadedTheme = mergeDeep(loadedTheme, customStyles)
            }
            setThemeVal(loadedTheme)
        }
        mounted();
    }, [theme])

    if (isUserSignedIn()) {
        return <Fragment>{children}</Fragment>
    }

    // const getCurrentPage = () => {
    //     switch (currentPage) {
    //         case "SignIn":
    //             return (
    //                 <Suspense fallback={<Fragment />}>
    //                     <DefaultSignIn
    //                         setCurrentPage={setCurrentPage}
    //                         dictionary={typeof dictionary === "object" ? { ...defaultDictionary, ...dictionary } : defaultDictionary}
    //                     />
    //                 </Suspense>
    //             )
    //         case "SignUp":
    //             return (
    //                 <Suspense fallback={<Fragment />}>
    //                     <DefaultSignUp
    //                         setCurrentPage={setCurrentPage}
    //                         dictionary={typeof dictionary === "object" ? { ...defaultDictionary, ...dictionary } : defaultDictionary}
    //                         signUpFields={typeof signUpFields === "object" ? signUpFields : {}}
    //                     />
    //                 </Suspense>
    //             )
    //         case "ForgotPassword":
    //             return (
    //                 <Suspense fallback={<Fragment />}>
    //                     <DefaultForgotPassword
    //                         setCurrentPage={setCurrentPage}
    //                         dictionary={typeof dictionary === "object" ? { ...defaultDictionary, ...dictionary } : defaultDictionary}
    //                     />
    //                 </Suspense>
    //             )
    //         default:
    //             return <React.Fragment />;
    //     }
    // }

    return (
        <ThemeProvider theme={themeVal}>
            {/* {getCurrentPage()} */}
            <Suspense fallback={<Fragment />}>
                <DefaultSignIn
                    setCurrentPage={setCurrentPage}
                    dictionary={typeof dictionary === "object" ? { ...defaultDictionary, ...dictionary } : defaultDictionary}
                />
            </Suspense>
        </ThemeProvider>
    )
}
