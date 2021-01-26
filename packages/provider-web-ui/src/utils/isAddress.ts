import { MAX_ALIAS_LENGTH } from '../constants';
import { cleanAddress } from './cleanAlias';

export function isAddress(address: string): boolean {
    return cleanAddress(address).length > MAX_ALIAS_LENGTH;
}
