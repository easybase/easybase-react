import React from 'react';
import styled from 'styled-components';

const ErrorText = styled.p(props => ({
    marginTop: 5,
    marginBottom: -5,
    fontSize: 12,
    fontWeight: 500,
    color: 'red',
    height: 0,
    overflow: 'visible',
    ...(props.theme.errorText ? { ...props.theme.errorText } : {})
}))

interface IErrorText extends React.HTMLAttributes<HTMLParagraphElement> {
    value?: string | undefined;
}

export default function (props: IErrorText) {
    if (props.value && props.value.length) {
        return <ErrorText {...props}>{props.value}</ErrorText>
    }
    return <React.Fragment />
}
