import { libs } from '@waves/waves-transactions';
import { IKeyPair, IUser, IEncryptedUserData } from '../../interface';
import { IState } from '../interface';

export const getPublicKeyHandler = (publicKey: string) => (): Promise<string> =>
    Promise.resolve(publicKey);

export const getUserDataHandler = (
    { privateKey, publicKey }: IKeyPair,
    state: IState<unknown>
) => {
    return (outPublicKey: string): Promise<IEncryptedUserData> => {
        const sharedKey = libs.crypto.sharedKey(privateKey, outPublicKey, '');

        return Promise.resolve({
            publicKey,
            encrypted: libs.crypto.base64Encode(
                libs.crypto.messageEncrypt(sharedKey, JSON.stringify(state))
            ),
        });
    };
};

export const setUserDataHandler = (
    { privateKey }: IKeyPair,
    state: IState<unknown>
) => (data: IEncryptedUserData): Promise<void> => {
    const bytes = libs.crypto.base64Decode(data.encrypted);
    const sharedKey = libs.crypto.sharedKey(privateKey, data.publicKey, '');
    const outState = JSON.parse(libs.crypto.messageDecrypt(sharedKey, bytes));

    Object.entries(outState).forEach(([key, value]) => {
        state[key] = value;
    });

    return Promise.resolve();
};
