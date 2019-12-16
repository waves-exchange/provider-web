import { MAX_ALIAS_LENGTH } from "@waves/waves-js/src/constants";

export function isAddress(addressOrAlias: string): boolean {
    return addressOrAlias.replace(/alias:.:/, '').length > MAX_ALIAS_LENGTH;
}