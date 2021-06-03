import React from 'react';
import styled from 'styled-components/native';

export const Form = styled.View((props: any) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 55,
    paddingBottom: 55,
    paddingRight: 33,
    paddingLeft: 33,
    ...(props.theme.form ? { ...props.theme.form } : {})
}))

export const HeaderText = styled.Text((props: any) => ({
    fontSize: 35,
    fontWeight: "bold",
    ...(props.theme.headerText ? { ...props.theme.headerText } : {})
}))

export const SpacerXL = styled.View((props: any) => ({
    height: 64
}))

export const SpacerL = styled.View((props: any) => ({
    height: 58
}))

export const SpacerS = styled.View((props: any) => ({
    height: 16
}))

export const Spacer = styled.View((props: any) => ({
    height: 37
}))

export const Input = styled.TextInput((props: any) => ({
    width: '100%',
    maxWidth: '100%',
    height: 46,
    borderColor: '#dbdbdb',
    borderStyle: 'solid',
    borderWidth: 1,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 28,
    display: 'inline-flex',
    background: 'transparent',
    transition: 'color .24s,background-color .24s,box-shadow .24s',
    outline: 'none',
    borderRadius: 4,
    padding: 12
    ...(props.theme.textField ? { ...props.theme.textField } : {})
}))

const SecondaryButtonRoot = styled.TouchableOpacity((props: any) => ({
    backgroundColor: 'transparent',
    width: "100%",
    height: 0,
    overflow: "visible",
    ...(props.theme.secondaryButtonRoot ? { ...props.theme.secondaryButtonRoot } : {})
}))

const SecondaryButtonText = styled.Text((props: any) => ({
    fontWeight: 'bold',
    fontSize: 14,
    color: '#534eff',
    justifyContent: "center",
    ...(props.theme.secondaryButton ? { ...props.theme.secondaryButton } : {})
}))

export const SecondaryButton = (props: any) => <SecondaryButtonRoot {...props}><SecondaryButtonText>{props.title}</SecondaryButtonText></SecondaryButtonRoot>

const ForgotButtonRoot = styled(SecondaryButtonRoot)((props: any) => ({
    ...(props.theme.forgotPasswordRoot ? { ...props.theme.forgotPasswordRoot } : {})
}))

const ForgotButtonText = styled(SecondaryButtonText)((props: any) => ({
    justifyContent: "start",
    ...(props.theme.forgotPassword ? { ...props.theme.forgotPassword } : {})
}))

export const ForgotPassword = (props: any) => <ForgotButtonRoot {...props}><ForgotButtonText>{props.title}</ForgotButtonText></ForgotButtonRoot>


const SubmitButtonRoot = styled.TouchableOpacity((props: any) => ({
    width: '100%',
    backgroundColor: 'rgb(99, 91, 255)',
    height: 44,
    borderRadius: 4,
    borderColor: '#534eff',
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...(props.theme.submitButtonRoot ? { ...props.theme.submitButtonRoot } : {})
}))

const SubmitButtonText = styled.Text((props: any) => ({
    fontWeight: 500,
    fontSize: 16,
    color: "#FFFFFF",
    ...(props.theme.submitButton ? { ...props.theme.submitButton } : {})
}))

export const SubmitButton = (props: any) => <SubmitButtonRoot {...props}><SubmitButtonText>{props.title}</SubmitButtonText></SubmitButtonRoot>
