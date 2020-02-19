import { Bus, config, WindowAdapter } from '@waves/waves-browser-bus';
import { libs } from '@waves/waves-transactions';
import { IBusEvents, TBusHandlers } from '../interface';
import { Queue } from '../utils/Queue';
import { getConnectHandler } from './handlers/connect';
import { getLoginHandler } from './handlers/login';
import {
    getPublicKeyHandler,
    getUserDataHandler,
    setUserDataHandler,
} from './handlers/moveUserHandlers';
import { getSignHandler } from './handlers/sign';
import { getSignMessageHandler } from './handlers/signMessage';
import { IState } from './interface';
import { analytics } from './utils/analytics';

config.console.logLevel = config.console.LOG_LEVEL.VERBOSE;
const queue = new Queue(3);

analytics.init({
    platform: 'web',
    userType: 'unknown',
    referrer: document.referrer,
});

WindowAdapter.createSimpleWindowAdapter()
    .then((adapter) => {
        const bus = new Bus<IBusEvents, TBusHandlers>(adapter);

        const state: IState = {
            user: null,
            networkByte: 87,
            nodeUrl: 'https://nodes.wavesplatform.com',
            matcherUrl: undefined,
        };

        const moveUserState = libs.crypto.keyPair(libs.crypto.randomSeed(25));

        bus.on('connect', getConnectHandler(state));

        bus.registerRequestHandler('login', getLoginHandler(queue, state));

        bus.registerRequestHandler(
            'get-public-key',
            getPublicKeyHandler(moveUserState.publicKey)
        );

        bus.registerRequestHandler(
            'get-user-data',
            getUserDataHandler(moveUserState, state)
        );

        bus.registerRequestHandler(
            'set-user-data',
            setUserDataHandler(moveUserState, state)
        );

        bus.registerRequestHandler(
            'sign-message',
            getSignMessageHandler(queue, state)
        );

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
