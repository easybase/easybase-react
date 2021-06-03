import { IDictionary } from "./uiTypes";

/**
* https://stackoverflow.com/a/48218209
*
* Performs a deep merge of objects and returns new object. Does not modify
* objects (immutable) and merges arrays via concatenation.
*
* @param {...object} objects - Objects to merge
* @returns {object} New object with merged key/values
*/
export function mergeDeep(...objects: any[]) {
    const isObject = (obj: any) => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach(key => {
            const pVal = prev[key];
            const oVal = obj[key];

            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = pVal.concat(...oVal);
            } else if (isObject(pVal) && isObject(oVal)) {
                prev[key] = mergeDeep(pVal, oVal);
            } else {
                prev[key] = oVal;
            }
        });

        return prev;
    }, {});
}

export const defaultDictionary: IDictionary = {
    newPasswordLabel: "Password *",
    confirmNewPasswordLabel: "Confirm Password *",
    newEmailLabel: "Email *",
    signUpSubmitButton: "Continue",
    backToSignIn: "Back to Sign In",
    signUpHeader: "Create your account",
    newFirstNameLabel: "First Name *",
    newLastNameLabel: "Last Name *",
    newFullNameLabel: "Full Name *",
    newDateOfBirthLabel: "Date of Birth *",
    newPhoneNumberLabel: "Phone Number *",
    
    /**
     * SignIn
     */
    signInHeader: "Sign in to your account",
    emailLabel: "Email",
    passwordLabel: "Password",
    forgotPasswordButton: "Forgot Your Password?",
    signInSubmitButton: "Continue",
    noAccountButton: "No Account? Sign Up",

    /**
     * ForgotPassword
     */
    forgotPasswordHeader: "Reset your password",
    forgotPasswordConfirmHeader: "Reset your password",
    forgotPasswordSecondaryHeader: "Enter your email address and we will send you a verification code.",
    forgotPasswordConfirmSubmitButton: "Continue",
    forgotPasswordSubmitButton: "Continue",
    codeLabel: "Code *",
    forgotPasswordConfirmLabel: "New Password *",

    /**
     * Errors
     */
     errorPasswordsDoNotMatch: "Passwords do not match",
     errorBadInputFormat: "Bad input format",
     errorPasswordTooShort: "Password must be at least 8 characters long",
     errorUserAlreadyExists: "An account with that email already exists",
     errorUserDoesNotExist: "Incorrect email or password",
     errorRequestLimitExceeded: "Password recently changed, please try again later",
     errorNoAccountFound: "No account found",
     errorWrongVerificationCode: "Incorrect verification code"
}
