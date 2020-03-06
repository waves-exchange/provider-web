import { IUserData } from '@waves/signer';
import { Bus, WindowAdapter, WindowProtocol } from '@waves/waves-browser-bus';
import { libs } from '@waves/waves-transactions';
import pipe from 'ramda/es/pipe';
import { Queue } from '../../utils/Queue';
import { IState } from '../interface';
import login from '../router/login';
import { analytics } from '../utils/analytics';
import { isSafari } from '../utils/isSafari';
import { preload, toQueue } from './helpers';

export const getLoginHandler = (
    queue: Queue,
    state: IState
): (() => Promise<IUserData>) =>
    toQueue(queue, () => {
        preload();

        if (window.top !== window && isSafari()) {
            const adapter = new WindowAdapter(
                [
                    new WindowProtocol(
                        window,
                        WindowProtocol.PROTOCOL_TYPES.LISTEN
                    ),
                ],
                [
                    new WindowProtocol(
                        window['__loginWindow'],
                        WindowProtocol.PROTOCOL_TYPES.DISPATCH
                    ),
                ]
            );
            const bus = new Bus(adapter);

            return new Promise((resolve, reject) => {
                bus.once('ready', () => {
                    bus.request('login', void 0, -1)
                        .then((res) => {
                            window['__loginWindow'].close();

                            resolve(res);
                        })
                        .catch(reject);
                });

                bus.request('login', void 0, -1)
                    .then((res) => {
                        window['__loginWindow'].close();

                        resolve(res);
                    })
                    .catch(reject);
            });
        } else {
            return login(state)().then((user) => {
                if (window.opener) {
                    window.opener['__setUser'](state.user);
                }

                analytics.addDefaultParams({
                    auuid: pipe(
                        libs.crypto.stringToBytes,
                        libs.crypto.blake2b,
                        libs.crypto.base64Encode
                    )(user.address, undefined),
                });

                return user;
            });
        }
    });
