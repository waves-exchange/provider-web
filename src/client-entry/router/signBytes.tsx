import { IState } from '../index';
import renderPage from '../utils/renderPage';
import { customData } from '@waves/waves-transactions';
import signCustom from '../pages/signCustom';
import React = require('react');
import { IUser } from '../../interface';


export default function (data: string, state: IState<IUser>): Promise<string> {

    const base64 = data.indexOf('base64:') === 0 ? data : `base64:${data}`;
    const signature = customData({
        binary: base64,
        version: 1
    }, state.user.seed).signature;

    return new Promise((resolve, reject) => {
        renderPage(React.createElement(signCustom, {
            networkByte: state.networkByte,
            title: 'dApp access sign of custom bytes',
            data: (
                <div >
                    <span >Bytes</span>
                    <span >{data}</span>
                </div>
            ),
            sender: state.user.address,
            onConfirm: () => {
                resolve(signature);
            },
            onCancel: () => {
                reject(new Error('User rejection!')); // TODO Add typed errors with codes
            }
        }));
    });
}