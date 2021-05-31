import React from 'react';
import Form from '../components/Form';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import HeaderText from '../components/HeaderText';
import ForgotPassword from '../components/ForgotPassword';
import SecondaryButton from '../components/SecondaryButton';
import SubmitButton from '../components/SubmitButton';
import Spacer from '../components/Spacer';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IPage } from '../types';
import useEasybase from '../../../useEasybase';

export default function ({ setCurrentPage }: IPage) {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
    const { signIn } = useEasybase();
    const onSubmit = async (formData: Record<string, string>) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const signInRes = await signIn(formData.email, formData.password);
        if (!signInRes.success) {
            if (signInRes.errorCode === "NoUserExists") {
                toast.error('Incorrect email or password')
            } else if (signInRes.errorCode === "BadFormat") {
                reset();
                toast.error('Bad input format')
            }
        }
        // Will automatically change views
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <HeaderText>Sign in to your account</HeaderText>
            <Spacer size="medium" />
            <EmailInput
                register={() => register("email")}
                label="Email"
                disabled={isSubmitting}
            />
            <Spacer size="xlarge" />
            <PasswordInput
                register={() => register("password")}
                autoComplete="current-password"
                disabled={isSubmitting}
            />
            <Spacer size="xlarge" />
            <ForgotPassword onClick={_ => setCurrentPage("forgotPassword")} disabled={isSubmitting}>Forgot Your Password?</ForgotPassword>
            <SubmitButton disabled={isSubmitting}>Continue</SubmitButton>
            <SecondaryButton onClick={_ => setCurrentPage("signUp")} disabled={isSubmitting}>No Account? Sign Up</SecondaryButton>
        </Form>
    )
}
