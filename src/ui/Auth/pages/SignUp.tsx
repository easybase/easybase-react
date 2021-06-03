import React, { Fragment } from 'react';
import Form from '../components/Form';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import HeaderText from '../components/HeaderText';
import SecondaryButton from '../components/SecondaryButton';
import SubmitButton from '../components/SubmitButton';
import Spacer from '../components/Spacer';
import ErrorText from '../components/ErrorText';
import GenderSelect from '../components/GenderSelect';
import Input from '../components/internal/Input';
import { useForm } from 'react-hook-form';
import { IPage, ISignUpFields } from '../../uiTypes';
import toast from 'react-hot-toast';
import useEasybase from '../../../useEasybase';

interface ISignUpPage extends IPage {
    signUpFields: ISignUpFields
}

export default function ({ setCurrentPage, dictionary, signUpFields }: ISignUpPage) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    const { signUp, signIn } = useEasybase();

    const onSubmit = async (formData: Record<string, string>) => {
        if (!formData.email || !formData.password || !formData.passwordConfirm) {
            return;
        }
        if (formData.password !== formData.passwordConfirm) {
            toast.error(dictionary.errorPasswordsDoNotMatch!);
            reset();
            return;
        }

        const signUpAttrs = { createdAt: new Date().toISOString() };
        for (const currField of ["firstName", "lastName", "fullName", "dateOfBirth", "gender", "phoneNumber"]) {
            if (signUpFields[currField]) {
                if (formData[currField]) {
                    signUpAttrs[currField] = "" + formData[currField];
                } else {
                    toast.error("Missing sign up field value");
                    return;
                }
            }
        }

        const signUpRes = await signUp(formData.email, formData.password, signUpAttrs);
        if (signUpRes.success) {
            setCurrentPage("SignIn")
            await signIn(formData.email, formData.password)
        } else {
            if (signUpRes.errorCode === "BadFormat") {
                reset();
                toast.error(dictionary.errorBadInputFormat!);
            } else if (signUpRes.errorCode === "BadPasswordLength") {
                toast.error(dictionary.errorPasswordTooShort!);
            } else if (signUpRes.errorCode === "UserExists") {
                reset();
                toast.error(dictionary.errorUserAlreadyExists!);
            }
        }
    }

    const passwordReqs = {
        minLength: {
            value: 8,
            message: "Password must be at least 8 characters long"
        },
        maxLength: {
            value: 100,
            message: "Password too long"
        },
        pattern: {
            value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/gm,
            message: "Must contain a digit and uppercase and lowercase letters"
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <HeaderText>{dictionary.signUpHeader}</HeaderText>
            <Spacer size="medium" />

            <EmailInput
                register={() => register("email")}
                label={dictionary.newEmailLabel}
                disabled={isSubmitting}
            />

            { signUpFields.firstName &&
                <Fragment>
                    <Spacer size="xlarge" />
                    <Input
                        register={() => register("firstName", typeof signUpFields.firstName === "boolean" ? {} : signUpFields.firstName)}
                        label={dictionary.newFirstNameLabel || ""}
                        disabled={isSubmitting}
                    />
                    <ErrorText value={errors.firstName?.message} />
                </Fragment>
            }

            { signUpFields.lastName &&
                <Fragment>
                    <Spacer size="xlarge" />
                    <Input
                        register={() => register("lastName", typeof signUpFields.lastName === "boolean" ? {} : signUpFields.lastName)}
                        label={dictionary.newLastNameLabel || ""}
                        disabled={isSubmitting}
                    />
                    <ErrorText value={errors.lastName?.message} />
                </Fragment>
            }

            { signUpFields.fullName &&
                <Fragment>
                    <Spacer size="xlarge" />
                    <Input
                        register={() => register("fullName", typeof signUpFields.fullName === "boolean" ? {} : signUpFields.fullName)}
                        label={dictionary.newFullNameLabel || ""}
                        disabled={isSubmitting}
                    />
                    <ErrorText value={errors.fullName?.message} />
                </Fragment>
            }

            { signUpFields.dateOfBirth &&
                <Fragment>
                    <Spacer size="xlarge" />
                    <Input
                        type="date"
                        register={() => register("dateOfBirth", typeof signUpFields.dateOfBirth === "boolean" ? {} : signUpFields.dateOfBirth)}
                        label={dictionary.newDateOfBirthLabel || ""}
                        disabled={isSubmitting}
                        style={{ overflow: "hidden" }}
                    />
                    <ErrorText value={errors.dateOfBirth?.message} />
                </Fragment>
            }

            { signUpFields.gender &&
                <Fragment>
                    <Spacer size="xlarge" />
                    <GenderSelect
                        register={() => register("gender", typeof signUpFields.gender === "boolean" ? {} : signUpFields.gender)}
                        disabled={isSubmitting}
                    />
                    <ErrorText value={errors.gender?.message} />
                </Fragment>
            }

            { signUpFields.phoneNumber &&
                <Fragment>
                    <Spacer size="xlarge" />
                    <Input
                        type="tel"
                        label={dictionary.newPhoneNumberLabel || ""}
                        register={() => register("phoneNumber", typeof signUpFields.phoneNumber === "boolean" ? {} : signUpFields.phoneNumber)}
                        disabled={isSubmitting}
                    />
                    <ErrorText value={errors.phoneNumber?.message} />
                </Fragment>
            }

            <Spacer size="xlarge" />
            <PasswordInput
                register={() => register("password", passwordReqs)}
                label={dictionary.newPasswordLabel}
                autoComplete="new-password"
                disabled={isSubmitting}
            />
            <ErrorText value={errors.password?.message} />
            <Spacer size="xlarge" />
            <PasswordInput
                register={() => register("passwordConfirm", passwordReqs)}
                label={dictionary.confirmNewPasswordLabel}
                autoComplete="new-password"
                disabled={isSubmitting}
            />
            <ErrorText value={errors.passwordConfirm?.message} />

            <Spacer size="xlarge" />
            <SubmitButton disabled={isSubmitting}>{dictionary.signUpSubmitButton}</SubmitButton>
            <SecondaryButton onClick={_ => setCurrentPage("SignIn")} disabled={isSubmitting}>{dictionary.backToSignIn}</SecondaryButton>
        </Form>
    )
}
