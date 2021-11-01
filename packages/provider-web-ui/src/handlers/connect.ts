import { ConnectOptions } from '@waves/signer';
import { IState } from '../interface';
import { analytics } from '../utils/analytics';

export function getConnectHandler(
    state: IState
): (options: ConnectOptions) => void {
    return (options): void => {
        state.nodeUrl = options.NODE_URL;
        state.networkByte = options.NETWORK_BYTE;

        analytics.addApi({
            apiToken:
                state.networkByte === 87
                    ? 'e3b3df0d53b4cae5b75350d898132934'
                    : 'ca96b9de2a3dd00b62ec70f7ef6ffb3e',
            libraryUrl: 'https://waves.exchange/amplitude.js',
            initializeMethod: 'amplitudeInit',
            sendMethod: 'amplitudePushEvent',
            type: 'logic',
        });

        analytics.addApi({
            apiToken:
                state.networkByte === 87 ? 'UA-154392329-1' : 'UA-154392329-2',
            libraryUrl: 'https://waves.exchange/googleAnalytics.js',
            initializeMethod: 'gaInit',
            sendMethod: 'gaPushEvent',
            type: 'ui',
        });

        analytics.activate();

        analytics.send({
            name: 'Signer_Connect',
            params: {
                Network_Byte: options.NETWORK_BYTE,
                Node_Url: options.NODE_URL,
            },
        });
    };
}
