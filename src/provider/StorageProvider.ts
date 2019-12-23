import {
    IConnectOptions,
    IProvider,
    ITypedData,
    IUserData,
    TTransactionParamWithType,
} from '@waves/waves-js';
import { IWithId, TTransactionWithProofs } from '@waves/ts-types';
import { ITransport } from './interface';
import { TransportIframe } from './TransportIframe';
import { TransportWindow } from './TransportWindow';
import { config } from '@waves/waves-browser-bus';

type TLong = string | number;

export class StorageProvider implements IProvider {
    private readonly _transport: ITransport;

    constructor(clientOrigin?: string, logs?: boolean) {
        clientOrigin = clientOrigin || 'https://waves.exchange/signer';
        const Transport = TransportIframe.canUse()
            ? TransportIframe
            : TransportWindow;

        this._transport = new Transport(clientOrigin, 3);
        if (logs != null) {
            config.console.logLevel = config.console.LOG_LEVEL.VERBOSE;
        }
    }

    public async connect(options: IConnectOptions): Promise<void> {
        return Promise.resolve(
            this._transport.event((bus) =>
                bus.dispatchEvent('connect', options)
            )
        );
    }

    public logout(): Promise<void> {
        return this._transport.dialog((bus) => bus.request('logout'));
    }

    public login(): Promise<IUserData> {
        return this._transport.dialog((bus) => bus.request('login'));
    }

    public signMessage(data: string | number): Promise<string> {
        return this._transport.dialog((bus) =>
            bus.request('sign-message', data)
        );
    }

    public signTypedData(data: Array<ITypedData>): Promise<string> {
        return this._transport.dialog((bus) =>
            bus.request('sign-typed-data', data)
        );
    }

    public sign(
        list: Array<TTransactionParamWithType>
    ): Promise<Array<TTransactionWithProofs<TLong> & IWithId>> {
        return this._transport.dialog((bus) => bus.request('sign', list));
    }
}
