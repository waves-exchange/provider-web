import {
    fetchBalance,
    fetchScriptInfo,
} from '@waves/node-api-js/es/api-node/addresses';
import { fetchByAddress } from '@waves/node-api-js/es/api-node/alias';
import { TLong } from '@waves/signer';
import { libs } from '@waves/waves-transactions';
import { IUser } from '../../interface';
import { IPrivateSeedUserData } from '../interface';
import { TCatchable } from '../utils/catchable';
import { getUserId } from '../utils/getUserId';
import { storage } from './storage';

export type StorageUser = IUser & {
    userType: 'keeper' | 'ledger' | 'seed' | 'privateKey';
};

export function getUsers(
    password: string,
    networkByte: number
): TCatchable<Array<StorageUser>> {
    const data = storage.getPrivateData(password);

    if (!data.ok) {
        return data;
    }

    return {
        ok: true,
        rejectData: null,
        resolveData: Object.entries(storage.get('multiAccountUsers'))
            .map(([hash, userData]) => ({
                hash,
                lastLogin: userData.lastLogin,
            }))
            .sort((a, b) => b.lastLogin - a.lastLogin)
            .reduce<Array<StorageUser>>((acc, { hash }) => {
                const privateData = data.resolveData[hash];

                if (!privateData) {
                    return acc;
                }

                switch (privateData.userType) {
                    case 'seed':
                        acc.push({
                            userType: privateData.userType,
                            address: libs.crypto.address(
                                privateData.seed,
                                networkByte
                            ),
                            privateKey: libs.crypto.privateKey(
                                privateData.seed
                            ),
                        });
                        break;
                    case 'privateKey':
                        acc.push({
                            userType: privateData.userType,
                            privateKey: privateData.privateKey,
                            address: libs.crypto.address(
                                privateData,
                                networkByte
                            ),
                        });
                        break;
                    default:
                        break;
                }

                return acc;
            }, []),
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

    return userData[id]?.name ?? 'Waves Account';
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

export function fetchAddressHasScript(
    base: string,
    address: string
): Promise<boolean> {
    return fetchScriptInfo(base, address)
        .then((info) => info.extraFee !== 0)
        .catch(() => false);
}
