import React from 'react';
import styled from 'styled-components';

const SecondaryText = styled.h2(props => ({
    fontFamily: "inherit",
    fontSize: 15,
    fontWeight: 300,
    letterSpacing: -.2,
    lineHeight: '20px',
    whiteSpace: 'normal',
    ...(props.theme.secondaryText ? { ...props.theme.secondaryText } : {})
}))

export default function (props: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <SecondaryText {...props} />
    )
}
