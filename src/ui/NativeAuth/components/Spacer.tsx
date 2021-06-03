import React from 'react';
import styled from 'styled-components/native';

const Spacer = styled.View({});

interface ISpacer {
    size?: "xlarge" | "large" | "medium" | "small"
}

export default function (props: ISpacer) {
    switch (props.size) {
        case "xlarge":
            return <Spacer style={{ height: 64 }} />   
        case "large":
            return <Spacer style={{ height: 58 }} />            
        case "small":
            return <Spacer style={{ height: 16 }} />
        default:
            return <Spacer style={{ height: 37 }} />
    }
}
