import { seedUtils, libs } from '@waves/waves-transactions';
import { curry } from 'ramda';
import { IUser } from '../../../interface';

export const getDecryptedStorageValue = (
    storage: Storage,
    key: string,
    password: string
): any => {
    const encryptedData = storage.getItem(key);

    if (!encryptedData) {
        return null;
    }

    let decryptedData;

    try {
        decryptedData = seedUtils.decryptSeed(encryptedData, password, 5000);
    } catch (error) {
        throw new Error('Could not decrypt data');
    }

    try {
        return JSON.parse(decryptedData);
    } catch (error) {
        throw new Error(`Could not JSON.parse(${key})`);
    }
};

export const getMultiaccountData = (password: string): object | null => {
    try {
        return getDecryptedStorageValue(
            localStorage,
            'multiAccountData',
            password
        );
    } catch (error) {
        if (error.message === 'Could not decrypt data') {
            throw new Error(error.message);
        } else if (error.message.startsWith === 'Could not JSON.parse') {
            throw new Error('Data is corrupt');
        } else {
            throw new Error('Unknown error');
        }
    }
};

export const getUsers = curry((networkByte: number, data: any): IUser[] => {
    try {
        return Object.keys(data).map((id) => ({
            address: libs.crypto.address(data[id].seed, networkByte),
            seed: data[id].seed,
        }));
    } catch (error) {
        throw new Error('Could not retreive users');
    }
});
