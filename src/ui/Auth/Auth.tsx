import React, { useEffect, useState } from 'react';
import Container from './components/Container';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { mergeDeep } from './utils';
import { IStyles, IAuth, IDefaultPages } from './types';
import useEasybase from '../../useEasybase';

export default function({ theme, customStyles, children }: IAuth): JSX.Element {
    const [themeVal, setThemeVal] = useState<any>({});
    const [pageElements, setPageElements] = useState<IDefaultPages | undefined>();
    const [currentPage, setCurrentPage] = useState<"SignIn" | "SignUp" | "ForgotPassword" | "ForgotPasswordConfirm">("SignIn");
    const { isUserSignedIn } = useEasybase();
    
    async function loadDefaultPages() {
        // Force code splitting
        const _signIn = (await import('./pages/SignIn')).default;
        const _signUp = (await import('./pages/SignUp')).default;
        const _forgotPassword = (await import('./pages/ForgotPassword')).default;
    
        setPageElements({
            SignIn: _signIn,
            SignUp: _signUp,
            ForgotPassword: _forgotPassword
        })
    }

    useEffect(() => {
        try {
            document.body.style.margin = "0px";
        } catch (_) {}
        async function mounted() {
            let loadedTheme: IStyles = {};
            if (theme === "minimal-dark") {
                loadDefaultPages()
                const _theme = (await import('./themes/minimal-dark')).default;
                if (_theme.init) {
                    _theme.init()
                }
                loadedTheme = _theme;
            } else if (theme === "material") {
                loadDefaultPages()
                const _theme = (await import('./themes/material')).default;
                if (_theme.init) {
                    _theme.init()
                }
                loadedTheme = _theme;
            } else {
                // catch all
                loadDefaultPages()
                const _theme = (await import('./themes/minimal')).default;
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
        if (!pageElements) {
            return <React.Fragment />;
        }

        switch (currentPage) {
            case "SignIn":
                return <pageElements.SignIn setCurrentPage={setCurrentPage} />
            case "SignUp":
                return <pageElements.SignUp setCurrentPage={setCurrentPage} />
            case "ForgotPassword":
                return <pageElements.ForgotPassword setCurrentPage={setCurrentPage} />
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
