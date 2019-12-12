import { libs, seedUtils } from '@waves/waves-transactions';
import { IUser } from '../../interface';

export function addUser(
    password: string,
    networkByte: number,
    rounds?: number
): IUser {
    console.log(networkByte, String.fromCharCode(networkByte));
    const seed =
        'merry help cycle scrub adult element initial old devote moon waste inside steel version post'; //libs.crypto.randomSeed(15);
    const address = libs.crypto.address(seed, networkByte);
    const publicKey = libs.crypto.publicKey(seed);
    const userType = 'seed';

    const id = libs.crypto.base58Encode(
        libs.crypto.blake2b(libs.crypto.base58Decode(networkByte + publicKey))
    );

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const users = JSON.parse(localStorage.getItem('multiAccountData') || '{}');
    const json = JSON.stringify({
        ...users,
        [id]: { seed, publicKey, networkByte: networkByte, userType },
    });
    const multiAccountHash = libs.crypto.base58Encode(
        libs.crypto.blake2b(libs.crypto.stringToBytes(json))
    );
    const multiAccountData = seedUtils.encryptSeed(
        json,
        password,
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        rounds || 5000
    );
    const multiAccountUsers = {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        ...JSON.parse(localStorage.getItem('multiAccountData') || '{}'),
        [id]: {
            name: 'dApp User',
        },
    };

    localStorage.setItem(
        'multiAccountUsers',
        JSON.stringify(multiAccountUsers)
    );
    localStorage.setItem('multiAccountHash', multiAccountHash);
    localStorage.setItem('multiAccountData', multiAccountData);

    return { seed, address };
}

export function hasUsers(): boolean {
    return localStorage.getItem('multiAccountData') != null;
}

export function isTermsAccepted(): boolean {
    try {
        const termsAccepted = localStorage.getItem('termsAccepted');

        return termsAccepted ? JSON.parse(termsAccepted) : false;
    } catch (e) {
        return false;
    }
}

export function saveTerms(accepted: boolean): void {
    return localStorage.setItem('termsAccepted', String(accepted));
}
