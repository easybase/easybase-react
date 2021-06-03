import React from "react";

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
    newFirstNameLabel?: string;
    newLastNameLabel?: string;
    newFullNameLabel?: string;
    newDateOfBirthLabel?: string;
    newPhoneNumberLabel?: string;

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

export interface INativeStyles {
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
    children: React.ReactNode;
    /** Theme for consistent styling, defaults to 'minimal' */
    theme?: "minimal" | "minimal-dark" | "material";
    /** Override specific styles for components of an Auth instance */
    customStyles?: IStyles;
    /** Edit specific language across the Auth instance components  */
    dictionary?: IDictionary;
    /** Extra fields that will be shown in the SignUp view of <Auth />. These fields are shown in addition Email, Password, and Confirm Password. */
    signUpFields?: ISignUpFields;
}

export interface INativeAuth {
    children: React.ReactNode;
    /** Override specific styles for components of an Auth instance */
    customStyles?: INativeStyles;
    /** Edit specific language across the Auth instance components  */
    dictionary?: IDictionary;
    /** Extra fields that will be shown in the SignUp view of <Auth />. These fields are shown in addition Email, Password, and Confirm Password. */
    signUpFields?: ISignUpFields;
}

type ValidationValueMessage<
    TValidationValue extends ValidationValue = ValidationValue,
    > = {
        value: TValidationValue;
        message: string;
    };

type ValidationValue = boolean | number | string | RegExp;

type ValidationRule<
    TValidationValue extends ValidationValue = ValidationValue,
    > = TValidationValue | ValidationValueMessage<TValidationValue>;

export interface ISignUpFieldValidators {
    required?: string | ValidationRule<boolean>;
    min?: ValidationRule<number | string>;
    max?: ValidationRule<number | string>;
    maxLength?: ValidationRule<number | string>;
    minLength?: ValidationRule<number | string>;
    pattern?: ValidationRule<RegExp>;
}

export interface ISignUpFields {
    firstName?: boolean | ISignUpFieldValidators;
    lastName?: boolean | ISignUpFieldValidators;
    fullName?: boolean | ISignUpFieldValidators;
    dateOfBirth?: boolean | ISignUpFieldValidators;
    gender?: boolean | ISignUpFieldValidators;
    phoneNumber?: boolean | ISignUpFieldValidators;
}

// TODO: allow custom components for individual Auth views.
// export interface ICustomViews {
//     SignIn?: JSX.Element;
//     SignUp?: JSX.Element;
//     ForgotPassword?: JSX.Element;
//     ForgotPasswordConfirm?: JSX.Element;
//     Fixed?: JSX.Element;
// }
