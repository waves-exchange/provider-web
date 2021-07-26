import { IUserWithBalances } from '../interface';
import { IState } from '../interface';
import { customData, libs } from '@waves/waves-transactions';
import renderPage from '../utils/renderPage';
import { SignMessageContainer } from '../pages/SignMessage/SignMessageContainer';
import React from 'react';

export default function (
    data: string | number,
    state: IState<IUserWithBalances>
): Promise<string> {
    const bytes = libs.crypto.stringToBytes(String(data));
    const base64 = 'base64:' + libs.crypto.base64Encode(bytes);

    const { signature } = customData(
        {
            binary: base64,
            version: 1,
        },
        {
            privateKey: state.user.privateKey,
        }
    );

    return new Promise((resolve, reject) => {
        renderPage(
            React.createElement(SignMessageContainer, {
                data: String(data),
                networkByte: state.networkByte,
                user: {
                    ...state.user,
                    publicKey: libs.crypto.publicKey({
                        privateKey: state.user.privateKey,
                    }),
                },
                // TODO Check as string
                onConfirm: () => {
                    resolve(signature as string);
                },
                onCancel: () => {
                    reject(new Error('User rejection!'));
                },
            })
        );
    });
}
