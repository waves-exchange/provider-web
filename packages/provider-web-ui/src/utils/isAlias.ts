import { cleanAddress } from './cleanAlias';
import { MAX_ALIAS_LENGTH } from '../constants';

export const isAlias = (address: string): boolean => {
    return cleanAddress(address).length <= MAX_ALIAS_LENGTH;
};
