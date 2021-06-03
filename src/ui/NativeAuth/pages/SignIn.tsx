import React from 'react';
import Form from '../components/Form';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import HeaderText from '../components/HeaderText';
import ForgotPassword from '../components/ForgotPassword';
import SecondaryButton from '../components/SecondaryButton';
import SubmitButton from '../components/SubmitButton';
import Spacer from '../components/Spacer';
import { useForm, Controller } from 'react-hook-form';
import { IPage } from '../../uiTypes';
import useEasybase from '../../../useEasybase';

export default function ({ setCurrentPage, dictionary }: IPage) {
    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm();
    const { signIn } = useEasybase();
    const onSubmit = async (formData: Record<string, string>) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const signInRes = await signIn(formData.email, formData.password);
        if (!signInRes.success) {
            if (signInRes.errorCode === "NoUserExists") {
                // toast.error(dictionary.errorUserDoesNotExist!)
            } else if (signInRes.errorCode === "BadFormat") {
                reset();
                // toast.error(dictionary.errorBadInputFormat!)
            }
        }
        // Will automatically change views
    }

    return (
        <Form>
            <HeaderText>{dictionary.signInHeader}</HeaderText>
            <Spacer size="medium" />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <EmailInput
                        onBlur={onBlur}
                        onChangeText={(value: any) => onChange(value)}
                        value={value}
                        label={dictionary.emailLabel}
                        disabled={isSubmitting}
                    />
                )}
                name="email"
                defaultValue=""
            />

            <Spacer size="xlarge" />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <PasswordInput
                        onBlur={onBlur}
                        onChangeText={(value: any) => onChange(value)}
                        value={value}
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        label={dictionary.passwordLabel}
                    />
                )}
                name="password"
                defaultValue=""
            />

            <Spacer size="xlarge" />
            <ForgotPassword onPress={(_: any) => setCurrentPage("ForgotPassword")} disabled={isSubmitting}>{dictionary.forgotPasswordButton}</ForgotPassword>
            <SubmitButton onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>{dictionary.signInSubmitButton}</SubmitButton>
            <SecondaryButton onPress={(_: any) => setCurrentPage("SignUp")} disabled={isSubmitting}>{dictionary.noAccountButton}</SecondaryButton>
        </Form>
    )
}
