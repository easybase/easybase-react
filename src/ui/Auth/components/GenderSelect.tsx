import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styled from 'styled-components';
import Label from './internal/Label';
import Select from './internal/Select';

const GenderSelect = styled(Select)(props => ({
    boxSizing: "border-box",
    ...(props.theme.genderSelect ? { ...props.theme.genderSelect } : {})
}))

const Root = styled.div({
    position: "relative"
})

interface ISelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
    register(): UseFormRegisterReturn;
}

const GenderLabel = styled(Label)(props => ({
    ...(props.theme.genderSelectLabel ? { ...props.theme.genderSelectLabel } : {})
}))

export default function (props: ISelect) {
    return (
        <Root>
            <GenderLabel htmlFor="select-gender">Gender *</GenderLabel>
            <GenderSelect id="select-gender" {...props} options={["Male", "Female", "Prefer not to say"]} />
        </Root>
    )
}
