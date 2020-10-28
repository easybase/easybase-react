import React from "react";
import g from "./g";

// https://gist.github.com/nicbell/6081098
export const shallowCompare = (obj1: {}, obj2: {}): boolean => {
    // Loop through properties in object 1
    for (const p in obj1) {
        // Check property exists on both objects
        
        if ({}.hasOwnProperty.call(obj1, p) !== {}.hasOwnProperty.call(obj2, p)) return false;

        switch (typeof (obj1[p])) {
            // Deep compare objects
            case 'object':
                if (!shallowCompare(obj1[p], obj2[p])) return false;
                break;
            // Compare function code
            case 'function':
                if (typeof (obj2[p]) === 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) return false;
                break;
            // Compare values
            default:
                if (obj1[p] !== obj2[p]) return false;
        }
    }

    // Check object 2 for any extra properties
    for (const p in obj2) {
        if (typeof (obj1[p]) === 'undefined') return false;
    }
    return true;
}

export const generateBareUrl = (type: string, integrationID: string): string => `https://api.easybase.io/${type}/${integrationID}`;

export const generateAuthBody = (): {} => {
    const stamp = Date.now();
    return {
        token: g.token,
        token_time: ~~(g.session / (stamp % 64)),
        now: stamp
    }
}
