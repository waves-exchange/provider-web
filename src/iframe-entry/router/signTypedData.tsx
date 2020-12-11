import { IState } from '../interface';
import { IUserWithBalances } from '../../interface';
import { customData, libs } from '@waves/waves-transactions';
import renderPage from '../utils/renderPage';
import React from 'react';
import { SignTypedDataContainer } from '../pages/SignTypedData/SignTypedDataContainer';
import { TypedData } from '@waves/signer';

export default function(
    data: Array<TypedData>,
    state: IState<IUserWithBalances>
): Promise<string> {
    const { signature } = customData(
        {
            data,
            version: 2,
        },
        state.user.privateKey
    );

    return new Promise((resolve, reject) => {
        renderPage(
            React.createElement(SignTypedDataContainer, {
                networkByte: state.networkByte,
                user: {
                    ...state.user,
                    publicKey: libs.crypto.publicKey({
                        privateKey: state.user.privateKey,
                    }),
                },
                data,
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
