import { defaultTheme } from '@waves.exchange/react-uikit';
import { Bus, config, WindowAdapter } from '@waves/waves-browser-bus';
import { IConnectOptions } from '@waves/waves-js';
import React from 'react';
import { IBusEvents, IUserWithBalances, TBusHandlers } from '../interface';
import { Queue } from '../utils/Queue';
import { IState } from './interface';
import Preload from './pages/Preload';
import login from './router/login';
import logout from './router/logout';
import sign from './router/sign';
import { fetchAliasses, fetchWavesBalance } from './services/userService';
import renderPage from './utils/renderPage';

const queue = new Queue(3);
const overlay = document.getElementById('overlay')!;
const preload = (): void => {
    renderPage(React.createElement(Preload));
};

preload();

overlay.style.background = defaultTheme.colors.standard.$1000;
overlay.style.opacity = '.6';

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
        });

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
                        return login(state)().then(apply);
                    }
                };

                if (queue.canPush()) {
                    return queue.push(action);
                } else {
                    return Promise.reject(new Error('Queue is full!'));
                }
            };
        };

        bus.registerRequestHandler('login', login(state));
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
