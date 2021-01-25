import { UserData } from '@waves/signer';
import { libs } from '@waves/waves-transactions';
import React from 'react';
import { IUser } from '../../interface';
import { IState } from '../interface';
import { CreateAccount } from '../pages/CreateAccount/CreateAccountContainer';
import { Login } from '../pages/Login/LoginContainer';
import {
    hasMultiaccount,
    isTermsAccepted,
    saveTerms,
} from '../services/userService';
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
            const termsAccepted = isTermsAccepted();

            analytics.send({
                name: hasMultiacc
                    ? 'Login_Page_Show'
                    : 'Create_Account_Page_Show',
            });

            return new Promise((resolve, reject) => {
                renderPage(
                    <Page
                        isPrivacyAccepted={termsAccepted}
                        isTermsAccepted={termsAccepted}
                        networkByte={state.networkByte}
                        onCancel={(): void => {
                            reject('User rejection!');
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
