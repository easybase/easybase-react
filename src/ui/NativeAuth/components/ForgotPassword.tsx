import React from 'react';
import TextButton from './internal/TextButton';
import styled from 'styled-components/native';

const ForgotPassword = styled(TextButton)(props => ({
    marginTop: -53,
    marginBottom: 53,
    display: 'flex',
    ...(props.theme.forgotPassword ? { ...props.theme.forgotPassword } : {})
}))

export default function (props: any) {
    return (
        <ForgotPassword {...props} />
    )
}
