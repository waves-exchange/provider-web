import propEq from 'ramda/es/propEq';
import allPass from 'ramda/es/allPass';
import { getUserId } from '../utils/getUserId';
import { storage } from './storage';
import { TCatchable } from '../utils/catchable';
import { libs } from '@waves/waves-transactions';
import { IPrivateSeedUserData, TPrivateUserData } from '../interface';

export function getUsers(
    password: string,
    networkByte: number
): TCatchable<Array<IPrivateSeedUserData>> {
    const data = storage.getPrivateData(password);

    if (!data.ok) {
        return data;
    }

    return {
        ...data,
        resolveData: Object.values(data.resolveData).filter(
            allPass([
                propEq('networkByte', networkByte),
                propEq('userType', 'seed'),
            ]) as (data: TPrivateUserData) => data is IPrivateSeedUserData
        ),
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

    storage.setPrivateData(users, password);

    return {
        ...data,
        resolveData: user,
    };
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
