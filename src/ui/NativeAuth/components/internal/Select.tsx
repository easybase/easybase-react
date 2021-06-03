import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styled from 'styled-components';

const SelectContainer = styled.div({
    position: 'relative',
    display: 'inline',
    width: '100%',
    maxWidth: '100%',
    cursor: 'pointer',
    '&:after': {
        content: "''",
        width: 0,
        height: 0,
        position: 'absolute',
        pointerEvents: 'none',
        top: '.3em',
        right: '.75em',
        borderTop: '8px solid black',
        opacity: 0.5,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent'
    }
})

const Select = styled.select({
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    padding: '1em 2em 1em 1em',
    border: 'none',
    width: '100%',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    cursor: 'pointer',
    outline: 'none',
    '&::-ms-expand': {
        display: 'none'
    }
})

const SelectOption = styled.option(props => ({
    width: '100%',
    ...(props.theme.selectOption ? { ...props.theme.selectOption } : {})
}))

interface ISelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: string[];
    id: string;
    register(): UseFormRegisterReturn;
}

export default function (props: ISelect) {
    return (
        <SelectContainer>
            <Select {...props} {...props.register()} defaultValue="">
                <SelectOption key="empty-option" value="" disabled hidden style={{ display: 'none' }} />
                {props.options.map(e => <SelectOption key={"option" + e}>{e}</SelectOption>)}
            </Select>
        </SelectContainer>
    )
}
