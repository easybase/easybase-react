import React from 'react';
import styled from 'styled-components/native';

const Label = styled.Text((props: any) => ({
    display: "none",
    fontFamily: "inherit",
    ...(props.theme.textFieldLabel ? { ...props.theme.textFieldLabel } : {})
}))

export default function (props: any) {
    return (<Label {...props} />)
}
