import { Bus, config, WindowAdapter } from '@waves/waves-browser-bus';
import { IConnectOptions, IUserData } from '@waves/signer';
import { libs } from '@waves/waves-transactions';
import React from 'react';
import {
    IBusEvents,
    IUserWithBalances,
    TBusHandlers,
    IUser,
} from '../interface';
import { Queue } from '../utils/Queue';
import { IState } from './interface';
import Preload from './pages/Preload';
import login from './router/login';
import logout from './router/logout';
import sign from './router/sign';
import { fetchAliasses, fetchWavesBalance } from './services/userService';
import renderPage from './utils/renderPage';
import { analytics } from './utils/analytics';

config.console.logLevel = config.console.LOG_LEVEL.VERBOSE;

const {
    crypto: { base64Encode, blake2b, stringToBytes },
} = libs;
const queue = new Queue(3);
const preload = (): void => {
    renderPage(React.createElement(Preload));
};

preload();

WindowAdapter.createSimpleWindowAdapter()
    .then((adapter) => {
        const bus = new Bus<IBusEvents, TBusHandlers>(adapter);

        const state: IState = {
            user: null,
            needConfirm: true,
            networkByte: 87,
            nodeUrl: 'https://nodes.wavesplatform.com',
            matcherUrl: 'https://nodes.wavesplatform.com/matcher',
        };

        bus.on('connect', (options: IConnectOptions) => {
            state.networkByte = options.NETWORK_BYTE;
            state.nodeUrl = options.NODE_URL;
            state.networkByte = options.NETWORK_BYTE;

            analytics.addApi({
                apiToken:
                    state.networkByte === 87
                        ? 'UA-152433785-1'
                        : 'UA-75283398-21',
                libraryUrl: 'https://waves.exchange/googleAnalytics.js', // TODO ???
                initializeMethod: 'gaInit',
                sendMethod: 'gaPushEvent',
                type: 'ui',
            });

            analytics.init({
                platform: 'web',
                userType: 'unknown',
                referrer: document.referrer,
            });

            analytics.activate();

            analytics.send({
                name: 'Signer_Connect',
                params: {
                    Network_Byte: options.NETWORK_BYTE, // eslint-disable-line @typescript-eslint/camelcase
                    Node_Url: options.NODE_URL, // eslint-disable-line @typescript-eslint/camelcase
                },
            });
        });

        const loginWithAnalytics = (handler: typeof login) => (
            state: IState<IUser | null>
        ) => async (): Promise<IUserData> => {
            return handler(state)().then((user) => {
                analytics.addDefaultParams({
                    auuid: base64Encode(blake2b(stringToBytes(user.address))),
                });

                return user;
            });
        };

        const wrapLogin = <T, R>(
            handler: (data: T, state: IState<IUserWithBalances>) => Promise<R>
        ): ((data: T) => Promise<R>) => {
            return async (data): Promise<R> => {
                const action = async (): Promise<R> => {
                    const apply = async (): Promise<R> => {
                        preload();

                        return Promise.all([
                            fetchAliasses(state.nodeUrl, state.user!.address),
                            fetchWavesBalance(
                                state.nodeUrl,
                                state.user!.address
                            ),
                        ]).then(([aliases, balance]) => {
                            const extendedState: IState<IUserWithBalances> = {
                                ...state,
                                user: {
                                    ...state.user!,
                                    aliases,
                                    balance,
                                },
                            };

                            return handler(data, extendedState);
                        });
                    };

                    if (state.user != null) {
                        return apply();
                    } else {
                        return loginWithAnalytics(login)(state)().then(apply);
                    }
                };

                if (queue.canPush()) {
                    return queue.push(action);
                } else {
                    return Promise.reject(new Error('Queue is full!'));
                }
            };
        };

        bus.registerRequestHandler('login', loginWithAnalytics(login)(state));
        bus.registerRequestHandler('logout', logout(state));

        // bus.registerRequestHandler('sign-custom-bytes', wrapLogin(signBytes));
        // bus.registerRequestHandler('sign-typed-data', wrapLogin(signTypedData));
        // bus.registerRequestHandler('sign-message', wrapLogin(signMessage));

        bus.registerRequestHandler('sign', wrapLogin(sign));

        // TODO add matcher sign
        // TODO add remove order sign
        // TODO add create order sign

        bus.dispatchEvent('ready', void 0);
    })
    .catch(console.error);
