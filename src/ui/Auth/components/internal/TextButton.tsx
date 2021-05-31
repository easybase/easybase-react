import React from 'react';
import styled from 'styled-components';

const TextButton = styled.button(props => ({
    cursor: "pointer",
    color: '#635bff',
    whiteSpace: 'nowrap',
    fontWeight: 500,
    fontSize: 14,
    margin: 0,
    background: 'none',
    border: 'none',
    ...(props.theme.textButton ? { ...props.theme.textButton } : {})
}))

export default function (props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <TextButton {...props} type="button" />
    )
}
