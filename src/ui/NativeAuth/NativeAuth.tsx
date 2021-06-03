import React, { useEffect, useState, lazy, Suspense, Fragment } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { mergeDeep, defaultDictionary } from '../utils';
import { INativeStyles, INativeAuth } from '../uiTypes';
import useEasybase from '../../useEasybase';

const DefaultSignIn = lazy(() => import('./pages/SignIn'));
// const DefaultSignUp = lazy(() => import('./pages/SignUp'));
// const DefaultForgotPassword = lazy(() => import('./pages/ForgotPassword'));

export default function ({ customStyles, children, dictionary, signUpFields }: INativeAuth): JSX.Element {
    const [currentPage, setCurrentPage] = useState<"SignIn" | "SignUp" | "ForgotPassword" | "ForgotPasswordConfirm">("SignIn");
    const { isUserSignedIn } = useEasybase();

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
        <ThemeProvider theme={typeof customStyles === "object" ? customStyles : {}}>
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
