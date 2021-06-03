import React from 'react';
import styled from 'styled-components';

const Label = styled.label(props => ({
    display: "none",
    fontFamily: "inherit",
    ...(props.theme.textFieldLabel ? { ...props.theme.textFieldLabel } : {})
}))

export default function (props: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (<Label {...props} />)
}
