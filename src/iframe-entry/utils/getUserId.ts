import { pipe } from 'ramda';
import { libs } from '@waves/waves-transactions';

export const getUserId = (networkByte: number, publicKey: string): string => {
    return pipe(
        libs.crypto.base58Decode,
        libs.crypto.blake2b,
        libs.crypto.base58Encode
    )(networkByte + publicKey);
};
