import React from 'react';
import TextButton from './internal/TextButton';
import styled from 'styled-components/native';

const SecondaryButton = styled(TextButton)(props => ({
    margin: '15px',
    ...(props.theme.secondaryButton ? { ...props.theme.secondaryButton } : {})
}))

export default function (props: any) {
    return (
        <SecondaryButton {...props} />
    )
}
