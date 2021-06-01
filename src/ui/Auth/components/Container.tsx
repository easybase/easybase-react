import React from 'react';
import styled from 'styled-components';

const Container = styled.div(props => ({
    height: "100%",
    width: "100%",
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'auto',
    boxSizing: 'content-box',
    ...(props.theme.container ? { ...props.theme.container } : {})
}))

export default function (props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <Container>{props.children}</Container>
    )
}
