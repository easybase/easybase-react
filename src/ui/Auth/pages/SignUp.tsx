import React from 'react';
import Form from '../components/Form';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import HeaderText from '../components/HeaderText';
import SecondaryButton from '../components/SecondaryButton';
import SubmitButton from '../components/SubmitButton';
import Spacer from '../components/Spacer';
import ErrorText from '../components/ErrorText';
import { useForm } from 'react-hook-form';
import { IPage } from '../uiTypes';
import toast from 'react-hot-toast';
import useEasybase from '../../../useEasybase';

export default function ({ setCurrentPage }: IPage) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    const { signUp, signIn } = useEasybase();

    const onSubmit = async (formData: Record<string, string>) => {
        if (!formData.email || !formData.password || !formData.passwordConfirm) {
            return;
        }
        if (formData.password !== formData.passwordConfirm) {
            toast('Passwords do not match');
            reset();
            return;
        }

        const signUpRes = await signUp(formData.email, formData.password, { createdAt: new Date().toISOString() });
        if (signUpRes.success) {
            setCurrentPage("signIn")
            await signIn(formData.email, formData.password)
        } else {
            if (signUpRes.errorCode === "BadFormat") {
                reset();
                toast.error('Bad input format');
            } else if (signUpRes.errorCode === "BadPasswordLength") {
                toast.error('Password must be at least 8 characters long');
            } else if (signUpRes.errorCode === "UserExists") {
                reset();
                toast.error('A user with that email already exists');
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
            <HeaderText>Create your account</HeaderText>
            <Spacer size="medium" />

            <EmailInput
                register={() => register("email")}
                label="Email *"
                disabled={isSubmitting}
            />

            <Spacer size="xlarge" />
            <PasswordInput
                register={() => register("password", passwordReqs)}
                label="Password *"
                autoComplete="new-password"
                disabled={isSubmitting}
            />
            <ErrorText value={errors.password?.message} />
            <Spacer size="xlarge" />
            <PasswordInput
                register={() => register("passwordConfirm", passwordReqs)}
                label="Confirm Password *"
                autoComplete="new-password"
                disabled={isSubmitting}
            />
            <ErrorText value={errors.passwordConfirm?.message} />

            <Spacer size="xlarge" />
            <SubmitButton disabled={isSubmitting}>Continue</SubmitButton>
            <SecondaryButton onClick={_ => setCurrentPage("signIn")} disabled={isSubmitting}>Back to Sign In</SecondaryButton>
        </Form>
    )
}
