import React, { useState } from 'react';
import Form from '../components/Form';
import EmailInput from '../components/EmailInput';
import HeaderText from '../components/HeaderText';
import SecondaryText from '../components/SecondaryText';
import SecondaryButton from '../components/SecondaryButton';
import SubmitButton from '../components/SubmitButton';
import Spacer from '../components/Spacer';
import { useForm } from 'react-hook-form';
import { IPage } from '../uiTypes';
import toast from 'react-hot-toast';
import ErrorText from '../components/ErrorText';
import Input from '../components/internal/Input';
import PasswordInput from '../components/PasswordInput';
import useEasybase from '../../../useEasybase';

export default function ({ setCurrentPage }: IPage) {
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
                toast.error('Password recently changed, please try again later');
            } else if (forgotRes.errorCode === "BadFormat") {
                reset();
                toast.error('Bad input format');
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
            setCurrentPage('signIn');
            toast.success('Password successfully changed')
        } else {
            if (forgotConfirmRes.errorCode === "BadPasswordLength") {
                toast.error('New password must be at least 8 characters long');
            } else if (forgotConfirmRes.errorCode === "BadFormat") {
                reset();
                toast.error('Bad input format');
            } else if (forgotConfirmRes.errorCode === "NoUserExists") {
                reset();
                toast.error('No user exists with that email');
            } else if (forgotConfirmRes.errorCode === "WrongVerificationCode") {
                toast.error('Incorrect verification code');
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
                <HeaderText>Reset your password</HeaderText>
                <SecondaryText>Enter your email address and we will send you a verification code.</SecondaryText>
                <Spacer size="medium" />
                <EmailInput
                    register={() => register("email")}
                    label="Email *"
                    disabled={isSubmitting}
                />
                <Spacer size="medium" />
                <SubmitButton disabled={isSubmitting}>Continue</SubmitButton>
                <SecondaryButton onClick={_ => setCurrentPage("signIn")} disabled={isSubmitting}>Back to Sign In</SecondaryButton>
            </Form>
        )
    } else {
        return (
            <Form onSubmit={handleSubmit(onConfirmSubmit)}>
                <HeaderText>Reset your password</HeaderText>
                <Spacer size="medium" />
                <Input
                    register={() => register("code", codeReqs)}
                    label="Code *"
                    disabled={isSubmitting}
                />
                <ErrorText value={errors.code?.message} />
                <Spacer size="xlarge" />
                <PasswordInput
                    register={() => register("newPassword", passwordReqs)}
                    label="New Password *"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                />
                <ErrorText value={errors.newPassword?.message} />
                <Spacer size="xlarge" />
                <SubmitButton disabled={isSubmitting}>Continue</SubmitButton>
                <SecondaryButton onClick={_ => setCurrentPage("signIn")} disabled={isSubmitting}>Back to Sign In</SecondaryButton>
            </Form>
        )
    }
}
