import React, { Fragment } from 'react';
import styled from 'styled-components/native';

export const View = styled.View({
    width: "100%"
});

export const Form = styled.View((props: any) => ({
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: '25%',
    paddingBottom: '25%',
    paddingRight: 33,
    paddingLeft: 33,
    ...(props.theme.form ? { ...props.theme.form } : {})
}))

export const HeaderText = styled.Text((props: any) => ({
    fontSize: 37,
    fontWeight: "bold",
    marginTop: 25,
    color: '#3c4257',
    width: '100%',
    textAlign: "left",
    ...(props.theme.headerText ? { ...props.theme.headerText } : {})
}))

export const SecondaryText = styled.Text((props: any) => ({
    fontSize: 15,
    fontWeight: '300',
    textAlign: "left",
    color: '#3c4257',
    width: '100%',
    ...(props.theme.secondaryText ? { ...props.theme.secondaryText } : {})
}))

export const SpacerXL = styled.View((props: any) => ({
    height: 64
}))

export const SpacerL = styled.View((props: any) => ({
    height: 58
}))

export const SpacerS = styled.View((props: any) => ({
    height: 24
}))

export const Spacer = styled.View((props: any) => ({
    height: 37
}))

export const Input = styled.TextInput((props: any) => ({
    width: '100%',
    maxWidth: '100%',
    height: 60,
    borderColor: '#dbdbdb',
    borderStyle: 'solid',
    borderWidth: 1,
    fontWeight: 400,
    fontSize: 24,
    background: 'transparent',
    borderRadius: 4,
    padding: 12,
    ...(props.theme.textField ? { ...props.theme.textField } : {})
}))

const SecondaryButtonRoot = styled.TouchableOpacity((props: any) => ({
    backgroundColor: 'transparent',
    height: 20,
    marginBottom: -20,
    overflow: "visible",
    ...(props.theme.secondaryButtonRoot ? { ...props.theme.secondaryButtonRoot } : {})
}))

const SecondaryButtonText = styled.Text((props: any) => ({
    fontWeight: 'bold',
    fontSize: 20,
    color: '#534eff',
    textAlign: "center",
    ...(props.theme.secondaryButton ? { ...props.theme.secondaryButton } : {})
}))

export const SecondaryButton = (props: any) => <SecondaryButtonRoot {...props}><SecondaryButtonText>{props.title}</SecondaryButtonText></SecondaryButtonRoot>

const ForgotButtonRoot = styled(SecondaryButtonRoot)((props: any) => ({
    width: "100%",
    ...(props.theme.forgotPasswordRoot ? { ...props.theme.forgotPasswordRoot } : {})
}))

const ForgotButtonText = styled(SecondaryButtonText)((props: any) => ({
    textAlign: "left",
    marginTop: 12,
    marginBottom: -12,
    fontSize: 14,
    ...(props.theme.forgotPassword ? { ...props.theme.forgotPassword } : {})
}))

export const ForgotPassword = (props: any) => <ForgotButtonRoot {...props}><ForgotButtonText>{props.title}</ForgotButtonText></ForgotButtonRoot>

const SubmitButtonRoot = styled.TouchableOpacity((props: any) => ({
    width: '100%',
    backgroundColor: 'rgb(99, 91, 255)',
    height: 60,
    borderRadius: 4,
    borderColor: '#534eff',
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(props.theme.submitButtonRoot ? { ...props.theme.submitButtonRoot } : {})
}))

const SubmitButtonText = styled.Text((props: any) => ({
    fontWeight: 'bold',
    fontSize: 20,
    color: "#FFFFFF",
    ...(props.theme.submitButton ? { ...props.theme.submitButton } : {})
}))

export const SubmitButton = (props: any) => <SubmitButtonRoot {...props}><SubmitButtonText>{props.title}</SubmitButtonText></SubmitButtonRoot>

const StyledErrorText = styled.Text((props: any) => ({
    marginTop: 5,
    marginBottom: -5,
    fontSize: 12,
    fontWeight: '500',
    color: '#FF0000',
    height: 0,
    overflow: 'visible',
    ...(props.theme.errorText ? { ...props.theme.errorText } : {})
}))

export const ErrorText = (props: any) => props.value ? <StyledErrorText>{props.value}</StyledErrorText> : <Fragment />

export const Picker = styled.Picker((props: any) => ({
    width: '100%',
    maxWidth: '100%',
    height: 46,
    borderColor: '#dbdbdb',
    borderStyle: 'solid',
    borderWidth: 1,
    fontWeight: 400,
    fontSize: 16,
    background: 'transparent',
    borderRadius: 4,
    padding: 12,
    ...(props.theme.picker ? { ...props.theme.picker } : {})
}))
