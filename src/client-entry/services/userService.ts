import propEq from 'ramda/es/propEq';
import { getUserId } from '../utils/getUserId';
import { storage } from './storage';
import { TCatchable } from '../utils/catchable';
import { libs } from '@waves/waves-transactions';
import { IPrivateSeedUserData, IPrivateKeyUserData } from '../interface';
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
    const candidates = Object.values(data.resolveData).filter(
        propEq('networkByte', networkByte)
    );

    const privateKeyStorageUsers = candidates.filter(
        propEq('userType', 'privateKey')
    ) as IPrivateKeyUserData[];

    const seedStorageUsers = candidates.filter(
        propEq('userType', 'seed')
    ) as IPrivateSeedUserData[];

    const privateKeyUsers = privateKeyStorageUsers.map(({ privateKey }) => ({
        address: libs.crypto.address(
            { publicKey: libs.crypto.publicKey({ privateKey }) },
            networkByte
        ),
        privateKey,
    }));

    const seedUsers = seedStorageUsers.map(({ seed: storageSeed }) => {
        const seed = storageSeed.startsWith('base58:')
            ? libs.crypto.base58Decode(storageSeed.replace('base58:', ''))
            : storageSeed;

        return {
            privateKey: libs.crypto.privateKey(seed),
            address: libs.crypto.address(seed, networkByte),
        };
    });

    return {
        ...data,
        resolveData: [...privateKeyUsers, ...seedUsers],
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
