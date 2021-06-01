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
import { IPage } from '../uiTypes';
import useEasybase from '../../../useEasybase';

export default function ({ setCurrentPage, dictionary }: IPage) {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
    const { signIn } = useEasybase();
    const onSubmit = async (formData: Record<string, string>) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const signInRes = await signIn(formData.email, formData.password);
        if (!signInRes.success) {
            if (signInRes.errorCode === "NoUserExists") {
                toast.error(dictionary.errorUserDoesNotExist!)
            } else if (signInRes.errorCode === "BadFormat") {
                reset();
                toast.error(dictionary.errorBadInputFormat!)
            }
        }
        // Will automatically change views
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <HeaderText>{dictionary.signInHeader}</HeaderText>
            <Spacer size="medium" />
            <EmailInput
                register={() => register("email")}
                label={dictionary.emailLabel}
                disabled={isSubmitting}
            />
            <Spacer size="xlarge" />
            <PasswordInput
                register={() => register("password")}
                autoComplete="current-password"
                disabled={isSubmitting}
                label={dictionary.passwordLabel}
            />
            <Spacer size="xlarge" />
            <ForgotPassword onClick={_ => setCurrentPage("ForgotPassword")} disabled={isSubmitting}>{dictionary.forgotPasswordButton}</ForgotPassword>
            <SubmitButton disabled={isSubmitting}>{dictionary.signInSubmitButton}</SubmitButton>
            <SecondaryButton onClick={_ => setCurrentPage("SignUp")} disabled={isSubmitting}>{dictionary.noAccountButton}</SecondaryButton>
        </Form>
    )
}
