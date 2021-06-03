import React from 'react';
import styled from 'styled-components/native';

const HeaderText = styled.Text((props: any) => ({
    fontFamily: "inherit",
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: -.2,
    margin: 0,
    marginTop: '16px !important',
    ...(props.theme.headerText ? { ...props.theme.headerText } : {})
}))

export default function (props: any) {
    return (
        <HeaderText {...props} />
    )
}
