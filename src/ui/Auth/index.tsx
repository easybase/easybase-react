import React, { useEffect, useState } from 'react';
import { IAuth } from './types';

export default function(props: IAuth): JSX.Element {
    const [Auth, setAuth] = useState<React.FC<IAuth> | undefined>();

    useEffect(() => {
        async function mounted() {
            const _auth = (await import('./Auth')).default;
            setAuth(_auth);
        }

        mounted()
    }, [])

    if (Auth) {
        return <Auth {...props} />
    }

    return <React.Fragment />
}

/**
 * Note that this wrapper component exists to force code-splitting
 */
