export const cleanAddress = (address: string): string => {
    return address.replace(/alias:.:/, '');
};
