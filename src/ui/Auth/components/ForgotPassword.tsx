import React from 'react';
import TextButton from './internal/TextButton';
import styled from 'styled-components';

const ForgotPassword = styled(TextButton)(props => ({
    marginTop: -53,
    marginBottom: 53,
    display: 'flex',
    ...(props.theme.forgotPassword ? { ...props.theme.forgotPassword } : {})
}))

export default function (props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <ForgotPassword {...props} type="button" />
    )
}
