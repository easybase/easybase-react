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

export default function ({ setCurrentPage, dictionary }: IPage) {
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

        const signUpRes = await signUp(formData.email, formData.password, { createdAt: new Date().toISOString() });
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
