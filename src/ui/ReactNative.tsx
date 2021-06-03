import React from 'react';
import { IAuth } from './uiTypes';
import styled from 'styled-components/native';

const Button = styled.Button({
    color: "red",
    fontSize: 20
})

export function NativeAuth (props: IAuth): JSX.Element {
    return (
        <Button title="Cloc" onPress={console.log} />
    )
}

export default NativeAuth;
