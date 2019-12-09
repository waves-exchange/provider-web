import { IState } from '../index';
import renderPage from '../utils/renderPage';
import { customData, libs } from '@waves/waves-transactions';
import signCustom from '../pages/signCustom';
import React = require('react');
import { IUser } from '../../interface';


export default function (data: string | number, state: IState<IUser>): Promise<string> {
    const bytes = libs.crypto.stringToBytes(String(data));
    const base64 = 'base64:' + libs.crypto.base64Encode(bytes);
    const signature = customData({
        binary: base64,
        version: 1
    }, state.user.seed).signature;

    return new Promise((resolve, reject) => {
        renderPage(React.createElement(signCustom, {
            networkByte: state.networkByte,
            title: 'dApp access sign of custom message',
            data: (
                <div >
                    <span >Message</span>
                    <span >{data}</span>
                </div>
            ),
            sender: state.user.address,
            onConfirm: () => {
                resolve(signature);
            },
            onCancel: () => {
                reject(new Error('User rejection!'));
            }
        }));
    });
}
