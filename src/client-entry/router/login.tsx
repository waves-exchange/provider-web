import Login from '../pages/login/Login';
import { IState } from '../index';
import renderPage from '../utils/renderPage';
import { libs } from '@waves/waves-transactions';
import { IUserData } from '@waves/waves-js/src/interface';
import { hasUsers } from '../services/userService';
import React = require('react');
import CreateAccount from '../pages/login/CreateAccount';


export default function (state: IState) {
    return (): Promise<IUserData> => {
        if (state.user) {
            return Promise.resolve({
                address: state.user.address,
                publicKey: libs.crypto.publicKey(state.user.seed)
            });
        } else {

            const Page = hasUsers() ? Login : CreateAccount;

            return new Promise((resolve, reject) => {
                renderPage(<Page
                    networkByte={state.networkByte}
                    onCancel={() => {
                        reject('User rejection!');
                    }}
                    onConfirm={user => {
                        state.user = user;
                        resolve({
                            address: user.address,
                            publicKey: libs.crypto.publicKey(user.seed)
                        });
                    }}
                />);
            });
        }
    };
}