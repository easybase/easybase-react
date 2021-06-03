import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { IPage } from '../../uiTypes';
import useEasybase from '../../../useEasybase';
import { Form, HeaderText, Spacer, SpacerXL, Input, ForgotPassword, SubmitButton, SecondaryButton } from '../components';

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
            <Spacer />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        placeholder={dictionary.emailLabel}
                        editable={!isSubmitting}
                        keyboardType="email-address"
                        returnKeyType="default"
                    />
                )}
                name="email"
                defaultValue=""
            />

            <SpacerXL />
            <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        placeholder={dictionary.passwordLabel}
                        editable={!isSubmitting}
                        returnKeyType="default"
                        secureTextEntry={true}
                    />
                )}
                name="password"
                defaultValue=""
            />

            <SpacerXL />
            <ForgotPassword onPress={(_: any) => setCurrentPage("ForgotPassword")} disabled={isSubmitting} title={dictionary.forgotPasswordButton!}  />
            <SubmitButton onPress={handleSubmit(onSubmit)} disabled={isSubmitting} title={dictionary.signInSubmitButton} />
            <SecondaryButton onPress={(_: any) => setCurrentPage("SignUp")} disabled={isSubmitting} title={dictionary.noAccountButton!} />
        </Form>
    )
}
