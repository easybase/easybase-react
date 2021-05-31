import React from 'react';

interface ISpacer {
    size?: "xlarge" | "large" | "medium" | "small"
}

export default function (props: ISpacer) {
    switch (props.size) {
        case "xlarge":
            return <div style={{ height: 64 }} />   
        case "large":
            return <div style={{ height: 58 }} />            
        case "small":
            return <div style={{ height: 16 }} />
        default:
            return <div style={{ height: 37 }} />
    }
}
