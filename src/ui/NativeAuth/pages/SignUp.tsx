import React, { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { INativePage, ISignUpFields } from '../../uiTypes';
import { Form, HeaderText, View, Input, SpacerXL, SubmitButton, SpacerS, SecondaryButton, ErrorText, Picker } from '../components';

const { useEasybase } = require('easybase-react');

interface ISignUpPage extends INativePage {
    signUpFields: ISignUpFields
}

export default function ({ setCurrentPage, dictionary, signUpFields, toast }: ISignUpPage) {
    const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
    const { signUp, signIn } = useEasybase();

    const onSubmit = async (formData: Record<string, string>) => {
        if (!formData.email || !formData.password || !formData.passwordConfirm) {
            return;
        }
        if (formData.password !== formData.passwordConfirm) {
            toast(dictionary.errorPasswordsDoNotMatch!);
            reset();
            return;
        }

        const signUpAttrs = { createdAt: new Date().toISOString() };
        for (const currField of ["firstName", "lastName", "fullName", "dateOfBirth", "gender", "phoneNumber"]) {
            if (signUpFields[currField]) {
                if (formData[currField]) {
                    signUpAttrs[currField] = "" + formData[currField];
                } else {
                    toast("Missing sign up field value");
                    return;
                }
            }
        }

        const signUpRes = await signUp(formData.email, formData.password, signUpAttrs);
        if (signUpRes.success) {
            setCurrentPage("SignIn")
            await signIn(formData.email, formData.password)
        } else {
            if (signUpRes.errorCode === "BadFormat") {
                reset();
                toast(dictionary.errorBadInputFormat!);
            } else if (signUpRes.errorCode === "BadPasswordLength") {
                toast(dictionary.errorPasswordTooShort!);
            } else if (signUpRes.errorCode === "UserExists") {
                reset();
                toast(dictionary.errorUserAlreadyExists!);
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
        <Form keyboardShouldPersistTaps="handled">
            <HeaderText>{dictionary.signUpHeader}</HeaderText>

            <View>
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

                {signUpFields.firstName &&
                    <Fragment>
                        <SpacerXL />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    placeholder={dictionary.newFirstNameLabel}
                                    editable={!isSubmitting}
                                    returnKeyType="default"
                                    autoCompleteType="name"
                                    autoCapitalize="words"
                                />
                            )}
                            name="firstName"
                            defaultValue=""
                            rules={typeof signUpFields.firstName === "boolean" ? {} : signUpFields.firstName}
                        />
                        <ErrorText value={errors.firstName?.message} />
                    </Fragment>
                }

                {signUpFields.lastName &&
                    <Fragment>
                        <SpacerXL />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    placeholder={dictionary.newLastNameLabel}
                                    editable={!isSubmitting}
                                    returnKeyType="default"
                                    autoCompleteType="name"
                                    autoCapitalize="words"
                                />
                            )}
                            name="lastName"
                            defaultValue=""
                            rules={typeof signUpFields.lastName === "boolean" ? {} : signUpFields.lastName}
                        />
                        <ErrorText value={errors.lastName?.message} />
                    </Fragment>
                }

                {signUpFields.fullName &&
                    <Fragment>
                        <SpacerXL />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    placeholder={dictionary.newFullNameLabel}
                                    editable={!isSubmitting}
                                    returnKeyType="default"
                                    autoCompleteType="name"
                                    autoCapitalize="words"
                                />
                            )}
                            name="fullName"
                            defaultValue=""
                            rules={typeof signUpFields.fullName === "boolean" ? {} : signUpFields.fullName}
                        />
                        <ErrorText value={errors.fullName?.message} />
                    </Fragment>
                }

                {signUpFields.gender &&
                    <Fragment>
                        <SpacerXL />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Picker
                                    onValueChange={value => onChange(value)}
                                    selectedValue={value}
                                    enabled={!isSubmitting}
                                >
                                    {["Male", "Female", "Prefer not to say"].map(e => <Picker.Item label={e} value={e} />)}
                                </Picker>
                            )}
                            name="gender"
                            defaultValue=""
                            rules={typeof signUpFields.gender === "boolean" ? {} : signUpFields.gender}
                        />
                        <ErrorText value={errors.gender?.message} />
                    </Fragment>
                }

                {signUpFields.phoneNumber &&
                    <Fragment>
                        <SpacerXL />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    placeholder={dictionary.newPhoneNumberLabel}
                                    editable={!isSubmitting}
                                    returnKeyType="default"
                                    keyboardType="number-pad"
                                />
                            )}
                            name="phoneNumber"
                            defaultValue=""
                            rules={typeof signUpFields.phoneNumber === "boolean" ? {} : signUpFields.phoneNumber}
                        />
                        <ErrorText value={errors.phoneNumber?.message} />
                    </Fragment>
                }

                <SpacerXL />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder={dictionary.newPasswordLabel}
                            editable={!isSubmitting}
                            returnKeyType="default"
                            secureTextEntry={true}
                            autoCompleteType="password"
                            autoCapitalize="none"
                        />
                    )}
                    name="password"
                    defaultValue=""
                    rules={passwordReqs}
                />
                <ErrorText value={errors.password?.message} />
                <SpacerXL />
                <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)}
                            value={value}
                            placeholder={dictionary.confirmNewPasswordLabel}
                            editable={!isSubmitting}
                            returnKeyType="default"
                            secureTextEntry={true}
                            autoCompleteType="password"
                            autoCapitalize="none"
                        />
                    )}
                    name="passwordConfirm"
                    defaultValue=""
                    rules={passwordReqs}
                />
                <ErrorText value={errors.passwordConfirm?.message} />
            </View>

            <View>
                <SubmitButton onPress={handleSubmit(onSubmit)} disabled={isSubmitting} title={dictionary.signUpSubmitButton} />
                <SpacerS />
                <SecondaryButton onPress={(_: any) => setCurrentPage("SignIn")} disabled={isSubmitting} title={dictionary.backToSignIn} />
            </View>
        </Form>
    )
}
