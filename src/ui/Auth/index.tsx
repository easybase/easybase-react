import React, { Suspense, Fragment, lazy } from 'react';
import { IAuth } from '../uiTypes';

const Auth = lazy(() => import('./Auth'));

export default function (props: IAuth): JSX.Element {
    return (
        <Suspense fallback={<Fragment />}>
            <Auth {...props} />
        </Suspense>
    )
}

/**
 * Note that this wrapper component exists to force code-splitting
 */
