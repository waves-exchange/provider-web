import { customData, libs, TDataEntry } from '@waves/waves-transactions';
import React from 'react';
import { IUserWithBalances } from '../interface';
import { IState } from '../interface';
import { SignTypedDataContainer } from '../pages/SignTypedData/SignTypedDataContainer';
import renderPage from '../utils/renderPage';

export default function (
    data: Array<TDataEntry>,
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
