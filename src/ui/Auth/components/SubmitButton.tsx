import React from 'react';
import styled from 'styled-components';

const SubmitButtonRoot = styled.div(props => props.theme.submitButtonRoot ? props.theme.submitButtonRoot : {});

const SubmitButton = styled.button(props => ({
    position: 'relative',
    border: "none",
    verticalAlign: "middle",
    textAlign: "center",
    textOverflow: "ellipsis",
    overflow: "hidden",
    outline: "none",
    cursor: "pointer",
    ...(props.theme.submitButton ? { ...props.theme.submitButton } : {})
}))

export default function (props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <SubmitButtonRoot>
            <SubmitButton type="submit" {...props} />
        </SubmitButtonRoot>
    )
}
