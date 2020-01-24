import { Bus, config, WindowAdapter } from '@waves/waves-browser-bus';
import { libs } from '@waves/waves-transactions';
import { IBusEvents, TBusHandlers, IEncryptedUserData } from '../interface';
import { Queue } from '../utils/Queue';
import { getConnectHandler } from './handlers/connect';
import { getLoginHandler } from './handlers/login';
import { getSignHandler } from './handlers/sign';
import { IState } from './interface';
import logout from './router/logout';

config.console.logLevel = config.console.LOG_LEVEL.VERBOSE;
const queue = new Queue(3);

WindowAdapter.createSimpleWindowAdapter()
    .then((adapter) => {
        const bus = new Bus<IBusEvents, TBusHandlers>(adapter);

        const state: IState = {
            user: null,
            networkByte: 87,
            nodeUrl: 'https://nodes.wavesplatform.com',
            matcherUrl: undefined,
        };

        const seed = libs.crypto.randomSeed();
        const publicKey = libs.crypto.publicKey(seed);
        const privateKey = libs.crypto.privateKey(seed);

        bus.on('connect', getConnectHandler(state));

        bus.registerRequestHandler('login', getLoginHandler(queue, state));
        bus.registerRequestHandler('logout', logout(state));

        bus.registerRequestHandler('get-public-key', () =>
            Promise.resolve(publicKey)
        );

        bus.registerRequestHandler(
            'set-user-data',
            (data: IEncryptedUserData): Promise<void> => {
                const bytes = libs.crypto.base64Decode(data.encrypted);
                const sharedKey = libs.crypto.sharedKey(
                    privateKey,
                    data.publicKey,
                    ''
                );
                const outState = JSON.parse(
                    libs.crypto.messageDecrypt(sharedKey, bytes)
                );

                Object.entries(outState).forEach(([key, value]) => {
                    state[key] = value;
                });

                return Promise.resolve();
            }
        );

        bus.registerRequestHandler('get-user-data', (outPublicKey: string) => {
            const sharedKey = libs.crypto.sharedKey(
                privateKey,
                outPublicKey,
                ''
            );

            return Promise.resolve({
                publicKey,
                encrypted: libs.crypto.base64Encode(
                    libs.crypto.messageEncrypt(sharedKey, JSON.stringify(state))
                ),
            });
        });

        // bus.registerRequestHandler('sign-custom-bytes', wrapLogin(signBytes));
        // bus.registerRequestHandler('sign-typed-data', wrapLogin(signTypedData));
        // bus.registerRequestHandler('sign-message', wrapLogin(signMessage));

        bus.registerRequestHandler('sign', getSignHandler(queue, state));

        // TODO add matcher sign
        // TODO add remove order sign
        // TODO add create order sign

        bus.dispatchEvent('ready', void 0);

        window.addEventListener('unload', () => {
            bus.dispatchEvent('close', undefined);
        });
    })
    .catch(console.error);
