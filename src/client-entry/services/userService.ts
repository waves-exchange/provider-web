// @ts-nocheck
import propEq from 'ramda/es/propEq';
import allPass from 'ramda/es/allPass';
import { getUserId } from '../utils/getUserId';
import { storage } from './storage';
import { TCatchable } from '../utils/catchable';
import { libs } from '@waves/waves-transactions';
import { IPrivateSeedUserData } from '../interface';
import { fetchBalance } from '@waves/node-api-js/es/api-node/addresses';
import { fetchByAddress } from '@waves/node-api-js/es/api-node/alias';
import { TLong } from '@waves/waves-js/dist/src/interface';
import { IUser } from '../../interface';

export function getUsers(
    password: string,
    networkByte: number
): TCatchable<Array<IUser>> {
    const data = storage.getPrivateData(password);

    if (!data.ok) {
        return data;
    }

    return {
        ...data,
        resolveData: Object.values(data.resolveData)
            .filter(
                allPass([
                    propEq('networkByte', networkByte),
                    propEq('userType', 'seed'),
                ])
            )
            .map((value) => ({
                address: libs.crypto.address(value.seed, networkByte),
                seed: value.seed,
            })),
    };
}

export function addSeedUser(
    seed: string,
    password: string,
    networkByte: number
): TCatchable<IPrivateSeedUserData> {
    const user: IPrivateSeedUserData = {
        networkByte,
        seed,
        publicKey: libs.crypto.publicKey(seed),
        userType: 'seed',
    };

    const data = storage.getPrivateData(password);

    if (!data.ok) {
        return data;
    }

    const userId = getUserId(networkByte, user.publicKey);
    const users = {
        ...data.resolveData,
        [userId]: user,
    };
    const name = 'Waves Account';
    const usersData = storage.get('multiAccountUsers');

    usersData[userId] = usersData[userId] ?? { name };

    storage.setPrivateData(users, password);
    storage.set('multiAccountUsers', usersData);

    return {
        ...data,
        resolveData: user,
    };
}

export function getUserName(networkByte: number, publicKey: string): string {
    const id = getUserId(networkByte, publicKey);
    const userData = storage.get('multiAccountUsers');

    return userData[id]?.name ?? 'Waves Acount';
}

export function hasMultiaccount(): boolean {
    return storage.hasPrivateData();
}

export function isTermsAccepted(): boolean {
    return storage.get('termsAccepted');
}

export function saveTerms(accepted: boolean): void {
    return storage.set('termsAccepted', accepted);
}

export function fetchAliasses(
    base: string,
    address: string
): Promise<Array<string>> {
    return fetchByAddress(base, address);
}

export function fetchWavesBalance(
    base: string,
    address: string
): Promise<TLong> {
    return fetchBalance(base, address).then((info) => info.balance);
}
