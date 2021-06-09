import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { INativePage } from '../../uiTypes';
import { Form, HeaderText, View, Input, SpacerXL, SubmitButton, SpacerS, SecondaryButton, ErrorText, SecondaryText, MainView, NoSecondaryButton } from '../components';

const { useEasybase } = require('easybase-react');

export default function ({ setCurrentPage, dictionary, toast, emailTemplate }: INativePage) {
    const [onConfirm, setOnConfirm] = useState<boolean>(false);
    const [forgottenUsername, setForgottenUsername] = useState<string | undefined>();
    const { control, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm();
    const { forgotPassword, forgotPasswordConfirm } = useEasybase();

    const onSubmit = async (formData: Record<string, string>) => {
        if (!formData.email) {
            return;
        }

        const forgotRes = await forgotPassword(formData.email, emailTemplate);
        if (forgotRes.success) {
            setForgottenUsername(formData.email);
            setOnConfirm(true);
            toast('Check your email for a verification code')
        } else {
            if (forgotRes.errorCode === "RequestLimitExceeded") {
                toast(dictionary.errorRequestLimitExceeded!);
            } else if (forgotRes.errorCode === "BadFormat") {
                reset();
                toast(dictionary.errorBadInputFormat!);
            } else if (forgotRes.errorCode === "NoUserExists") {
                reset();
                toast(dictionary.errorNoAccountFound!);
            } else {
                reset();
                toast('Bad request');
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
            toast('Password successfully changed')
        } else {
            if (forgotConfirmRes.errorCode === "BadPasswordLength") {
                toast(dictionary.errorPasswordTooShort!);
            } else if (forgotConfirmRes.errorCode === "BadFormat") {
                reset();
                toast(dictionary.errorBadInputFormat!);
            } else if (forgotConfirmRes.errorCode === "NoUserExists") {
                reset();
                toast(dictionary.errorNoAccountFound!);
            } else if (forgotConfirmRes.errorCode === "WrongVerificationCode") {
                toast(dictionary.errorWrongVerificationCode!);
            } else {
                toast('Bad request');
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
            <Form>
                <HeaderText>{dictionary.forgotPasswordHeader}</HeaderText>

                <MainView>
                    <SecondaryText>{dictionary.forgotPasswordSecondaryHeader}</SecondaryText>
                    <SpacerXL />
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                placeholder={dictionary.newEmailLabel}
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
                </MainView>

                <View>
                    <SubmitButton onPress={handleSubmit(onSubmit)} disabled={isSubmitting} title={dictionary.forgotPasswordSubmitButton} />
                    <SpacerS />
                    <SecondaryButton onPress={(_: any) => setCurrentPage("SignIn")} disabled={isSubmitting} title={dictionary.backToSignIn} />
                </View>
            </Form>
        )
    } else {
        return (
            <Form>
                <HeaderText>{dictionary.forgotPasswordConfirmHeader}</HeaderText>

                <MainView>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                placeholder={dictionary.codeLabel}
                                editable={!isSubmitting}
                                returnKeyType="default"
                                autoCapitalize="characters"
                            />
                        )}
                        name="code"
                        defaultValue=""
                        rules={codeReqs}
                    />
                    <ErrorText value={errors.code?.message} />
                    <SpacerXL />
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                placeholder={dictionary.forgotPasswordConfirmLabel}
                                editable={!isSubmitting}
                                returnKeyType="default"
                                secureTextEntry={true}
                                autoCompleteType="password"
                                autoCapitalize="none"
                            />
                        )}
                        name="newPassword"
                        defaultValue=""
                        rules={passwordReqs}
                    />
                    <ErrorText value={errors.newPassword?.message} />
                </MainView>
                
                <View>
                    <SubmitButton onPress={handleSubmit(onConfirmSubmit)} disabled={isSubmitting} title={dictionary.forgotPasswordConfirmSubmitButton} />
                    <SpacerS />
                    <NoSecondaryButton />
                </View>
            </Form>
        )
    }
}
