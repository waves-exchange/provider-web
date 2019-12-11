import { Bus, config, WindowAdapter } from '@waves/waves-browser-bus';
import login from './router/login';
import logout from './router/logout';
import signTypedData from './router/signTypedData';
import signMessage from './router/signMessage';
import signBytes from './router/signBytes';
import { IBusEvents, TBusHandlers, IUser } from '../interface';
import { IConnectOptions } from '@waves/waves-js/dist/src/interface';
import sign from './router/sign';
import { defaultTheme } from '@waves/react-uikit';
import renderPage from './utils/renderPage';
import React from 'react';
import Preload from './pages/Preload';
import { Queue } from '../utils/Queue';

config.console.logLevel = config.console.LOG_LEVEL.VERBOSE;

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
            handler: (data: T, state: IState<IUser>) => Promise<R>
        ): ((data: T) => Promise<R>) => {
            return async (data): Promise<R> => {
                const action = async (): Promise<R> => {
                    const apply = async (): Promise<R> =>
                        handler(data, state as IState<IUser>);

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

        bus.registerRequestHandler('sign-custom-bytes', wrapLogin(signBytes));
        bus.registerRequestHandler('sign-typed-data', wrapLogin(signTypedData));
        bus.registerRequestHandler('sign-message', wrapLogin(signMessage));

        bus.registerRequestHandler('sign', wrapLogin(sign));

        // TODO add matcher sign
        // TODO add remove order sign
        // TODO add create order sign

        bus.dispatchEvent('ready', void 0);
    })
    .catch(console.error);

export interface IState<USER = IUser | null> {
    user: USER;
    needConfirm: boolean;
    networkByte: number;
    nodeUrl: string;
    matcherUrl: string;
}
