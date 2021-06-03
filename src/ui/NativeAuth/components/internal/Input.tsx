import React from 'react';
import styled from 'styled-components/native';
import Label from './Label';

const TextFieldRoot = styled.View((props: any) => ({
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    padding: 0,
    height: 46,
    ...(props.theme.textFieldRoot ? { ...props.theme.textFieldRoot } : {})
}))

const TextField = styled.TextInput((props: any) => ({
    display: "block",
    width: '100%',
    background: '0 0',
    border: 'none',
    fontFamily: "inherit",
    ...(props.theme.textField ? { ...props.theme.textField } : {})
}))

const Bar = styled.View((props: any) => props.theme.textFieldBar ? { ...props.theme.textFieldBar } : {})

export default function (props: any) {
    return (
        <TextFieldRoot>
            <TextField placeholder="&nbsp;" {...props}/>
            <Bar />
            <Label>{props.label}</Label>
        </TextFieldRoot>
    )
}
