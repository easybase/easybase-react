import React, { Suspense, Fragment, lazy } from 'react';
import { INativeAuth } from './uiTypes';

const NativeAuthComp = lazy(() => import('./NativeAuth/NativeAuth'));

export function NativeAuth(props: INativeAuth): JSX.Element {
    return (
        <Suspense fallback={<Fragment />}>
            <NativeAuthComp {...props} />
        </Suspense>
    )
}

/**
 * Note that this wrapper component exists to force code-splitting
 */
