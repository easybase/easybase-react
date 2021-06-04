import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { INativePage } from '../../uiTypes';
import { Form, HeaderText, View, Input, SubmitButton, SecondaryButton, ForgotPassword, SpacerS, SpacerXL, MainView } from '../components';

const { useEasybase } = require('easybase-react');

export default function ({ setCurrentPage, dictionary, toast }: INativePage) {
    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm();
    const { signIn } = useEasybase();

    const onSubmit = async (formData: Record<string, string>) => {
        if (!formData.email || !formData.password) {
            return;
        }
        
        const signInRes = await signIn(formData.email, formData.password);
        if (!signInRes.success) {
            if (signInRes.errorCode === "NoUserExists") {
                toast(dictionary.errorUserDoesNotExist!)
            } else if (signInRes.errorCode === "BadFormat") {
                reset();
                toast(dictionary.errorBadInputFormat!)
            }
        }
        // Will automatically change views
    }

    return (
        <Form>
            <HeaderText>{dictionary.signInHeader}</HeaderText>

            <MainView>
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
                            autoCompleteType="email"
                            autoCapitalize="none"
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
                            autoCompleteType="password"
                            autoCapitalize="none"
                        />
                    )}
                    name="password"
                    defaultValue=""
                />
                <ForgotPassword onPress={(_: any) => setCurrentPage("ForgotPassword")} disabled={isSubmitting} title={dictionary.forgotPasswordButton!} />
            </MainView>

            <View>
                <SubmitButton onPress={handleSubmit(onSubmit)} disabled={isSubmitting} title={dictionary.signInSubmitButton} />
                <SpacerS />
                <SecondaryButton onPress={(_: any) => setCurrentPage("SignUp")} disabled={isSubmitting} title={dictionary.noAccountButton!} />
            </View>
        </Form>
    )
}
