import React from 'react';
import styled from 'styled-components/native';

const Form = styled.View((props: any) => ({
    display: "flex",
    justifyContent: "center",
    padding: '33px 55px',
    flexDirection: 'column',
    fontFamily: "inherit",
    margin: '0px !important',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...(props.theme.form ? { ...props.theme.form } : {})
}))

export default function (props: any) {
    return (
        <Form {...props}>{props.children}</Form>
    )
}
