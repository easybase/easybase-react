import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styled from 'styled-components';
import Label from './internal/Label';
import Select from './internal/Select';

const GenderSelect = styled(Select)(props => props.theme.genderSelect ? { ...props.theme.genderSelect } : {})

const Root = styled.div({
    position: "relative"
})

interface ISelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
    register(): UseFormRegisterReturn;
}

export default function (props: ISelect) {
    return (
        <Root>
            <Label htmlFor="select-gender">Gender *</Label>
            <GenderSelect id="select-gender" {...props} options={["Male", "Female", "Prefer not to say"]} />
        </Root>
    )
}
