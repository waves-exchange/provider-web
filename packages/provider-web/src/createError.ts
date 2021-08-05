export const createError = (error: Error) => {
    const commonError = {
        code: 0,
        message: error?.message || error,
    };

    switch (error?.message) {
        // eslint-disable-next-line max-len
        case "SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document.":
            return {
                ...commonError,
                message:
                    'Local storage is not available! It is possible that the Browser is in incognito mode!',
            };

        default:
            return commonError;
    }
};
