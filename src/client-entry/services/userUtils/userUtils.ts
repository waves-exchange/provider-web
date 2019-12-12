import pipe from 'ramda/es/pipe';
import { libs } from '@waves/waves-transactions';
import { TPrivateMultiaccountData } from '../userService';

export const serializeUsers = JSON.stringify.bind(JSON);

export const usersToJson = (users: TPrivateMultiaccountData | string): string =>
    typeof users === 'string' ? users : serializeUsers(users);

export const craeteMultiAccountHash = pipe(
    usersToJson,
    libs.crypto.stringToBytes,
    libs.crypto.blake2b,
    libs.crypto.base58Encode
);

export const encryptMultiAccountData = (
    users: TPrivateMultiaccountData,
    passowrd: string,
    rounds = 5000
): string => libs.crypto.encryptSeed(serializeUsers(users), passowrd, rounds);

export const isValidUsersDataJSON = (users: string, hash: string): boolean => {
    return craeteMultiAccountHash(users) === hash;
};

export const decryptMultiAccountData = (
    users: string,
    hash: string,
    passowrd: string,
    rounds = 5000
): TPrivateMultiaccountData => {
    const json = libs.crypto.decryptSeed(users, passowrd, rounds);

    if (isValidUsersDataJSON(json, hash) === false) {
        throw new Error('Hash does not match!');
    }

    return JSON.parse(json);
};

export function getUserId(networkByte: number, publicKey: string): string {
    return pipe(
        libs.crypto.base58Decode,
        libs.crypto.blake2b,
        libs.crypto.base58Encode
    )(networkByte + publicKey);
}
