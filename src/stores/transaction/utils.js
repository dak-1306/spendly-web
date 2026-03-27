export const makeKey = (name, args) => `${name}|${JSON.stringify(args || {})}`;
export const pendingRequests = {};
