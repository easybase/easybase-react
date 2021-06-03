import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View((props: any) => ({
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...(props.theme.container ? { ...props.theme.container } : {})
}))

export default function (props: any) {
    return (
        <Container>{props.children}</Container>
    )
}
