import React from 'react';
import styled from 'styled-components';

const HeaderText = styled.h1(props => ({
    fontFamily: "inherit",
    fontSize: 24,
    fontWeight: 500,
    letterSpacing: -.2,
    ...(props.theme.headerText ? { ...props.theme.headerText } : {})
}))

export default function (props: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <HeaderText {...props} />
    )
}
