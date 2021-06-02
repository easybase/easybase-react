import React, { Fragment, useEffect, useState } from 'react';

export default function (props: any): JSX.Element {
    const [ReactNative, setReactNative] = useState<any>();
    useEffect(() => {
        if ((typeof navigator !== 'undefined' && navigator.product === 'ReactNative')) {
            const _importName = 'react-native';
            try {
                import(_importName).then(RN => {
                    setReactNative(RN)
                })
            } catch (error) {
                console.error('No RN detected')
            }
        }
    }, [])

    if (!ReactNative) {
        return <Fragment />
    } else {
        return (
            <ReactNative.View>
                <ReactNative.Text>Hello</ReactNative.Text>
            </ReactNative.View>
        )
    }
}

/**
 * Note that this wrapper component exists to force code-splitting
 */
