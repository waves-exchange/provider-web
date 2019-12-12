import { libs } from '@waves/waves-transactions';
import propEq from 'ramda/es/propEq';
import {
    decryptMultiAccountData,
    getUserId,
    craeteMultiAccountHash,
} from './userUtils/userUtils';
import { storage } from './storage';

export function getUsers(
    password: string,
    networkByte: number
): Array<TPrivateUserData> {
    return Object.values(
        decryptMultiAccountData(
            storage.get('multiAccountData'),
            storage.get('multiAccountHash'),
            password,
            5000
        )
    ).filter(propEq('networkByte', networkByte));
}

export function addUser(
    seed: string,
    password: string,
    networkByte: number
): TPrivateUserData {
    const users = decryptMultiAccountData(
        storage.get('multiAccountData'),
        storage.get('multiAccountHash'),
        password,
        5000
    );
    const user: TPrivateUserData = {
        networkByte,
        publicKey: libs.crypto.privateKey(seed),
        seed,
        userType: 'seed',
    };

    const id = getUserId(networkByte, user.publicKey);
    const json = JSON.stringify({ ...users, [id]: user });
    const hash = craeteMultiAccountHash(json);

    storage.set('multiAccountHash', hash);
    storage.set('multiAccountData', json);

    return user;
}

export function hasMultiaccount(): boolean {
    return storage.get('multiAccountHash') !== '';
}

export function termsAccepted(): boolean {
    return storage.get('termsAccepted');
}

export function saveTerms(accepted: boolean): void {
    return storage.set('termsAccepted', accepted);
}

export type TPrivateMultiaccountData = Record<string, TPrivateUserData>;
export interface TPrivateUserData {
    networkByte: number;
    publicKey: string;
    seed?: string;
    userType: 'seed' | 'keeper' | 'ledger';
}
