import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styled from 'styled-components';
import Label from './Label';

const TextFieldRoot = styled.div(props => ({
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    padding: 0,
    fontFamily: "inherit",
    ...(props.theme.textFieldRoot ? { ...props.theme.textFieldRoot } : {})
}))

const TextField = styled.input(props => ({
    display: "block",
    width: '100%',
    background: '0 0',
    border: 'none',
    fontFamily: "inherit",
    ...(props.theme.textField ? { ...props.theme.textField } : {})
}))

const Bar = styled.div(props => props.theme.textFieldBar ? { ...props.theme.textFieldBar } : {})

interface ITextField extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    register(): UseFormRegisterReturn
}

export default function (props: ITextField) {
    return (
        <TextFieldRoot>
            <TextField placeholder="&nbsp;" {...props} {...props.register()} id={"textField-" + props.label.replace(/[^a-zA-Z]+/g, '')} />
            <Bar />
            <Label htmlFor={"textField-" + props.label.replace(/[^a-zA-Z]+/g, '')}>{props.label}</Label>
        </TextFieldRoot>
    )
}
