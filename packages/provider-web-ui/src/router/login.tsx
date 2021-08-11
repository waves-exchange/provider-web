import { UserData } from '@waves/signer';
import { libs } from '@waves/waves-transactions';
import React from 'react';
import { IUser } from '../interface';
import { IState } from '../interface';
import { CreateAccount } from '../pages/CreateAccount/CreateAccountContainer';
import { Login } from '../pages/Login/LoginContainer';
import { hasMultiaccount, saveTerms } from '../services/userService';
import { analytics } from '../utils/analytics';
import renderPage from '../utils/renderPage';

export default function (state: IState): () => Promise<UserData> {
    return (): Promise<UserData> => {
        if (state.user != null) {
            return Promise.resolve({
                address: state.user.address,
                publicKey: libs.crypto.publicKey({
                    privateKey: state.user.privateKey,
                }),
            });
        } else {
            const hasMultiacc = hasMultiaccount();
            const Page = hasMultiacc ? Login : CreateAccount;

            analytics.send({
                name: hasMultiacc
                    ? 'Login_Page_Show'
                    : 'Create_Account_Page_Show',
            });

            return new Promise((resolve, reject) => {
                renderPage(
                    <Page
                        networkByte={state.networkByte}
                        onCancel={(): void => {
                            reject(new Error('User rejection!'));
                        }}
                        onConfirm={(user: IUser): void => {
                            state.user = user;
                            saveTerms(true);
                            resolve({
                                address: user.address,
                                publicKey: libs.crypto.publicKey({
                                    privateKey: user.privateKey,
                                }),
                            });
                        }}
                    />
                );
            });
        }
    };
}
