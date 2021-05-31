import React from "react";

export interface IPage {
    setCurrentPage: React.Dispatch<React.SetStateAction<any>>;
}

export interface IStyles {
    init?: () => any;
    container?: Record<string, any>;
    textFieldRoot?: Record<string, any>;
    textField?: Record<string, any>;
    textFieldLabel?: Record<string, any>;
    submitButton?: Record<string, any>;
    genderSelect?: Record<string, any>;
    toast?: Record<string, any>;
    form?: Record<string, any>;
    headerText?: Record<string, any>;
    secondaryText?: Record<string, any>;
    secondaryButton?: Record<string, any>;
    errorText?: Record<string, any>;
    textButton?: Record<string, any>;
    selectOption?: Record<string, any>;
    textFieldBar?: Record<string, any>;
    forgotPassword?: Record<string, any>;
}

export interface IAuth {
    theme?: "minimal" | "minimal-dark" | "material";
    customStyles?: IStyles;
    children: React.ReactNode
}

export interface IDefaultPages {
    SignIn: React.FC<IPage>;
    SignUp: React.FC<IPage>;
    ForgotPassword: React.FC<IPage>;
}
