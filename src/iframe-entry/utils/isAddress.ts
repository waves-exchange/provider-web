const MAX_ALIAS_LENGTH = 30;

export function isAddress(addressOrAlias: string): boolean {
    return addressOrAlias.replace(/alias:.:/, '').length > MAX_ALIAS_LENGTH;
}
