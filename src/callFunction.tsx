import { callFunction as _callFunction } from 'easybasejs';

/**
 * @async
 * Call a cloud function, created in Easybase interface.
 * @param {string} route Route as detailed in Easybase. Found under 'Deploy'. Will be in the form of ####...####-function-name.
 * @param {Record<string, any>} postBody Optional object to pass as the body of the POST request. This object will available in your cloud function's event.body.
 * @return {Promise<string>} Response from your cloud function. Detailed with a call to 'return context.succeed("RESPONSE")'.
 */
export const callFunction = _callFunction;
