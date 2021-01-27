import { pipe } from 'ramda';
import { libs } from '@waves/waves-transactions';
import usersToJson from './usersToJson';

export const createMultiAccountHash = pipe(
    usersToJson,
    libs.crypto.stringToBytes,
    libs.crypto.blake2b,
    libs.crypto.base58Encode
);
