import renderPage from '../utils/renderPage';
import { libs } from '@waves/waves-transactions';
import { IUserData } from '@waves/waves-js/src/interface';
import { hasMultiaccount, saveTerms, isTermsAccepted } from '../services/userService';
import { CreateAccount } from '../pages/CreateAccount/CreateAccountContainer';
import { Login } from '../pages/Login/LoginContainer';
import { IUser } from '../../interface';
import React from 'react';
import { IState } from '../interface';

export default function(state: IState) {
    return async (): Promise<IUserData> => {
        if (state.user != null) {
            return Promise.resolve({
                address: state.user.address,
                publicKey: libs.crypto.publicKey(state.user.seed),
            });
        } else {
            const Page = hasMultiaccount() ? Login : CreateAccount;
            const termsAccepted = isTermsAccepted();

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
                                publicKey: libs.crypto.publicKey(user.seed),
                            });
                        }}
                    />
                );
            });
        }
    };
}
