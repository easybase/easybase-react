import React, { useState } from 'react';
import Form from '../components/Form';
import EmailInput from '../components/EmailInput';
import HeaderText from '../components/HeaderText';
import SecondaryText from '../components/SecondaryText';
import SecondaryButton from '../components/SecondaryButton';
import SubmitButton from '../components/SubmitButton';
import Spacer from '../components/Spacer';
import { useForm } from 'react-hook-form';
import { IPage } from '../../uiTypes';
import toast from 'react-hot-toast';
import ErrorText from '../components/ErrorText';
import Input from '../components/internal/Input';
import PasswordInput from '../components/PasswordInput';
import useEasybase from '../../../useEasybase';

export default function ({ setCurrentPage, dictionary }: IPage) {
    const [onConfirm, setOnConfirm] = useState<boolean>(false);
    const [forgottenUsername, setForgottenUsername] = useState<string | undefined>();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
    const { forgotPassword, forgotPasswordConfirm } = useEasybase();

    const onSubmit = async (formData: Record<string, string>) => {
        if (!formData.email) {
            return;
        }

        const forgotRes = await forgotPassword(formData.email, { greeting: "Hello user," });
        if (forgotRes.success) {
            setForgottenUsername(formData.email);
            setOnConfirm(true);
            toast.success('Check your email for a verification code')
        } else {
            if (forgotRes.errorCode === "RequestLimitExceeded") {
                toast.error(dictionary.errorRequestLimitExceeded!);
            } else if (forgotRes.errorCode === "BadFormat") {
                reset();
                toast.error(dictionary.errorBadInputFormat!);
            } else if (forgotRes.errorCode === "NoUserExists") {
                reset();
                toast.error(dictionary.errorNoAccountFound!);
            } else {
                reset();
                toast.error('Bad request');
            }
        }
    }

    const onConfirmSubmit = async (formData: Record<string, string>) => {
        if (!formData.code || !formData.newPassword || !forgottenUsername) {
            return;
        }
        const forgotConfirmRes = await forgotPasswordConfirm(formData.code, forgottenUsername, formData.newPassword)
        if (forgotConfirmRes.success) {
            setOnConfirm(false);
            setForgottenUsername("");
            setCurrentPage('SignIn');
            toast.success('Password successfully changed')
        } else {
            if (forgotConfirmRes.errorCode === "BadPasswordLength") {
                toast.error(dictionary.errorPasswordTooShort!);
            } else if (forgotConfirmRes.errorCode === "BadFormat") {
                reset();
                toast.error(dictionary.errorBadInputFormat!);
            } else if (forgotConfirmRes.errorCode === "NoUserExists") {
                reset();
                toast.error(dictionary.errorNoAccountFound!);
            } else if (forgotConfirmRes.errorCode === "WrongVerificationCode") {
                toast.error(dictionary.errorWrongVerificationCode!);
            } else {
                toast.error('Bad request');
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

    const codeReqs = {
        minLength: {
            value: 8,
            message: "Incorrect code length"
        }
    }

    if (!onConfirm) {
        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                <HeaderText>{dictionary.forgotPasswordHeader}</HeaderText>
                <SecondaryText>{dictionary.forgotPasswordSecondaryHeader}</SecondaryText>
                <Spacer size="medium" />
                <EmailInput
                    register={() => register("email")}
                    label={dictionary.newEmailLabel}
                    disabled={isSubmitting}
                />
                <Spacer size="medium" />
                <SubmitButton disabled={isSubmitting}>{dictionary.forgotPasswordSubmitButton}</SubmitButton>
                <SecondaryButton onClick={_ => setCurrentPage("SignIn")} disabled={isSubmitting}>{dictionary.backToSignIn}</SecondaryButton>
            </Form>
        )
    } else {
        return (
            <Form onSubmit={handleSubmit(onConfirmSubmit)}>
                <HeaderText>{dictionary.forgotPasswordConfirmHeader}</HeaderText>
                <Spacer size="medium" />
                <Input
                    register={() => register("code", codeReqs)}
                    label={dictionary.codeLabel!}
                    disabled={isSubmitting}
                />
                <ErrorText value={errors.code?.message} />
                <Spacer size="xlarge" />
                <PasswordInput
                    register={() => register("newPassword", passwordReqs)}
                    label={dictionary.forgotPasswordConfirmLabel}
                    autoComplete="new-password"
                    disabled={isSubmitting}
                />
                <ErrorText value={errors.newPassword?.message} />
                <Spacer size="xlarge" />
                <SubmitButton disabled={isSubmitting}>{dictionary.forgotPasswordConfirmSubmitButton}</SubmitButton>
            </Form>
        )
    }
}
