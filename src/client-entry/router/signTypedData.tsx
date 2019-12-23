import { IState } from '../interface';
import renderPage from '../utils/renderPage';
import signCustom from '../pages/signCustom';
import { customData } from '@waves/waves-transactions';
import DataEntryList from '../components/dataEntryList';
import { ITypedData } from '@waves/waves-js';
import React from 'react';
import { IUser } from '../../interface';

export default function(
    data: Array<ITypedData>,
    state: IState<IUser>
): Promise<string> {
    const signature = customData(
        {
            data,
            version: 2,
        } as any,
        state.user.seed
    ).signature; // TODO Fix any

    return new Promise((resolve, reject) => {
        renderPage(
            React.createElement(signCustom, {
                networkByte: state.networkByte,
                title: 'dApp access sign of typed data',
                data: <DataEntryList data={data} />,
                sender: state.user.address,
                onConfirm: () => {
                    resolve(signature);
                },
                onCancel: () => {
                    reject(new Error('User rejection!'));
                },
            })
        );
    });
}
