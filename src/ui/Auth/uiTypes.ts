import React from "react";

export interface IPage {
    setCurrentPage: React.Dispatch<React.SetStateAction<any>>;
    dictionary: IDictionary;
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
    /** Theme for consistent styling, defaults to 'minimal' */
    theme?: "minimal" | "minimal-dark" | "material";
    /** Override specific styles for components of an Auth instance */
    customStyles?: IStyles;
    children: React.ReactNode;
    /** Edit specific language across the Auth instance components  */
    dictionary?: IDictionary;
}

export interface IDictionary {
    /**
     * SignUp
     */
    newPasswordLabel?: string;
    confirmNewPasswordLabel?: string;
    newEmailLabel?: string;
    signUpSubmitButton?: string;
    backToSignIn?: string;
    signUpHeader?: string;

    /**
     * SignIn
     */
    signInHeader?: string;
    emailLabel?: string;
    passwordLabel?: string;
    forgotPasswordButton?: string;
    signInSubmitButton?: string;
    noAccountButton?: string;

    /**
     * ForgotPassword
     */
    forgotPasswordHeader?: string;
    forgotPasswordConfirmHeader?: string;
    forgotPasswordSecondaryHeader?: string;
    forgotPasswordConfirmSubmitButton?: string;
    forgotPasswordSubmitButton?: string;
    codeLabel?: string;
    forgotPasswordConfirmLabel?: string;

    /**
     * Errors
     */
    errorPasswordsDoNotMatch?: string;
    errorBadInputFormat?: string;
    errorPasswordTooShort?: string;
    errorUserAlreadyExists?: string;
    errorUserDoesNotExist?: string;
    errorRequestLimitExceeded?: string;
    errorNoAccountFound?: string;
    errorWrongVerificationCode?: string;

}

// TODO: finish possible types
export interface SignUpField {
    firstName?: boolean;
    lastName?: boolean;
    fullName?: boolean;
    dateOfBirth?: boolean;
    gender?: boolean;
    tos?: boolean;
    phoneNumber?: boolean;
}
