import React, { Suspense, Fragment, lazy } from 'react';
import { IAuth } from './uiTypes';

const NativeAuthComp = lazy(() => import('./NativeAuth/NativeAuth'));

export function NativeAuth(props: IAuth): JSX.Element {
    return (
        <Suspense fallback={<Fragment />}>
            <NativeAuthComp {...props} />
        </Suspense>
    )
}

export default NativeAuth;

/**
 * Note that this wrapper component exists to force code-splitting
 */
