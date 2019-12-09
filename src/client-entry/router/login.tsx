import Login from '../pages/login/Login';
import { IState } from '../index';
import renderPage from '../utils/renderPage';
import { libs } from '@waves/waves-transactions';
import { IUserData } from '@waves/waves-js/src/interface';
import { hasUsers } from '../services/userService';
import CreateAccount from '../pages/login/CreateAccount';
import { IUser } from '../../interface';
import React from 'react';

export default function(state: IState) {
    return async (): Promise<IUserData> => {
        if (state.user != null) {
            return Promise.resolve({
                address: state.user.address,
                publicKey: libs.crypto.publicKey(state.user.seed),
            });
        } else {
            const Page = hasUsers() ? Login : CreateAccount;

            return new Promise((resolve, reject) => {
                renderPage(
                    <Page
                        networkByte={state.networkByte}
                        onCancel={(): void => {
                            reject('User rejection!');
                        }}
                        onConfirm={(user: IUser): void => {
                            state.user = user;
                            resolve({
                                address: user.address,
                                publicKey: libs.crypto.publicKey(user.seed),
                            });
                        }}
                    />
                );
            });
        }
    };
}
