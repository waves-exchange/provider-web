import pipe from 'ramda/es/pipe';
import { libs } from '@waves/waves-transactions';
import usersToJson from './usersToJson';

export default pipe(
    usersToJson,
    libs.crypto.stringToBytes,
    libs.crypto.blake2b,
    libs.crypto.base58Encode
);
