import React, { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import Input from './internal/Input';

interface ITextField extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    register(): UseFormRegisterReturn
}

export default function(props: ITextField) {
    return (
        <Input label="Email" autoComplete="email" {...props} type="email" required />
    )
}
