import React from 'react';
import Input from './internal/Input';

export default function(props: any) {
    return (
        <Input label="Email" autoComplete="email" {...props} type="email" required />
    )
}
