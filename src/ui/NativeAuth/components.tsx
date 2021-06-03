import React from 'react';
import styled from 'styled-components/native';

export const Form = styled.View(props => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
}))

export const HeaderText = styled.Text(props => ({
    fontSize: 35,
    fontWeight: "bold"
}))

export const SpacerXL = styled.View(props => ({
    height: 64
}))

export const SpacerL = styled.View(props => ({
    height: 58
}))

export const SpacerS = styled.View(props => ({
    height: 16
}))

export const Spacer = styled.View(props => ({
    height: 37
}))

export const Input = styled.TextInput(props => ({
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
}))

export const ForgotPassword = styled.Button(props => ({
    color: '#635bff',
    fontWeight: 'bold',
    fontSize: 14
}))

const SubmitButtonRoot = styled.TouchableOpacity(props => ({
    width: '100%',
    backgroundColor: 'rgb(99, 91, 255)',
    height: 44,
    borderRadius: 4,
    borderColor: '#534eff',
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
}))

const SubmitButtonText = styled.Text(props => ({
    fontWeight: 500,
    fontSize: 16
}))

export const SubmitButton = (props: any) => <SubmitButtonRoot {...props}><SubmitButtonText>{props.title}</SubmitButtonText></SubmitButtonRoot>

export const SecondaryButton = styled.Button(props => ({
    color: '#635bff',
    fontWeight: 'bold',
    fontSize: 14
}))
