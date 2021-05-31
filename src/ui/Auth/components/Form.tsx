import React from 'react';
import styled from 'styled-components';

const Form = styled.form(props => ({
    display: "flex",
    justifyContent: "center",
    width: 390,
    padding: '33px 55px',
    boxShadow: '0 5px 10px 0 rgb(0 0 0 / 10%)',
    borderRadius: 10,
    flexDirection: 'column',
    fontFamily: "inherit",
    margin: '6% auto 50px',
    '@media (max-width: 520px)': {
        margin: '0px !important',
        position: 'fixed !important',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 'initial !important'
    },
    ...(props.theme.form ? { ...props.theme.form } : {})
}))

export default function (props: React.FormHTMLAttributes<HTMLFormElement>) {
    return (
        <Form {...props}>{props.children}</Form>
    )
}
