import { IConnectOptions } from '@waves/signer';
import { IState } from '../interface';
import { analytics } from '../utils/analytics';

export function getConnectHandler(
    state: IState
): (options: IConnectOptions) => void {
    return (options): void => {
        state.networkByte = options.NETWORK_BYTE;
        state.nodeUrl = options.NODE_URL;
        state.networkByte = options.NETWORK_BYTE;

        analytics.addApi({
            apiToken:
                state.networkByte === 87 ? 'UA-152433785-1' : 'UA-75283398-21',
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
    };
}
