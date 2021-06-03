import React from 'react';
import styled from 'styled-components/native';

const SubmitButtonRoot = styled.View((props: any) => props.theme.submitButtonRoot ? props.theme.submitButtonRoot : {});

const SubmitButton = styled.Button((props: any) => ({
    position: 'relative',
    border: "none",
    verticalAlign: "middle",
    textAlign: "center",
    textOverflow: "ellipsis",
    overflow: "hidden",
    outline: "none",
    cursor: "pointer",
    boxSizing: 'border-box',
    ...(props.theme.submitButton ? { ...props.theme.submitButton } : {})
}))

export default function (props: any) {
    return (
        <SubmitButtonRoot>
            <SubmitButton type="submit" {...props} />
        </SubmitButtonRoot>
    )
}
