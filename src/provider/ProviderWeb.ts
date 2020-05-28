import {
    IConnectOptions,
    IProvider,
    ITypedData,
    IUserData,
    TLong,
    TTransactionParamWithType,
} from '@waves/signer';
import { IWithId, TTransactionWithProofs } from '@waves/ts-types';
import { config } from '@waves/waves-browser-bus';
import { isSafari } from '../iframe-entry/utils/isSafari';
import { ITransport } from './interface';
import { TransportIframe } from './TransportIframe';

export class ProviderWeb implements IProvider {
    private readonly _transport: ITransport<HTMLIFrameElement>;
    private readonly _clientUrl: string;
    private _userData: IUserData | undefined;

    constructor(clientUrl?: string, logs?: boolean) {
        this._clientUrl =
            (clientUrl || 'https://waves.exchange/signer/') +
            '?' +
            ProviderWeb._getCacheClean();

        this._transport = new TransportIframe(this._clientUrl, 3);

        if (logs === true) {
            config.console.logLevel = config.console.LOG_LEVEL.VERBOSE;
        }
    }

    private static _getCacheClean(): string {
        return String(Date.now() % (1000 * 60));
    }

    public async connect(options: IConnectOptions): Promise<void> {
        return Promise.resolve(
            this._transport.sendEvent((bus) =>
                bus.dispatchEvent('connect', options)
            )
        );
    }

    public logout(): Promise<void> {
        this._userData = undefined;

        return Promise.resolve(this._transport.dropConnection());
    }

    public login(): Promise<IUserData> {
        if (this._userData) {
            return Promise.resolve(this._userData);
        }

        const iframe = this._transport.get();

        if (isSafari()) {
            const win = iframe.contentWindow?.open(this._clientUrl);

            if (!win) {
                throw new Error('Window was blocked');
            }
        }

        iframe.src = this._clientUrl;

        return this._transport.dialog((bus) =>
            bus
                .request('login')
                .then((userData) => {
                    this._userData = userData;

                    return userData;
                })
                .catch((err) => {
                    this._transport.dropConnection();

                    return Promise.reject(err);
                })
        );
    }

    public signMessage(data: string | number): Promise<string> {
        return this.login().then(() =>
            this._transport.dialog((bus) => bus.request('sign-message', data))
        );
    }

    public signTypedData(data: Array<ITypedData>): Promise<string> {
        return this.login().then(() =>
            this._transport.dialog((bus) =>
                bus.request('sign-typed-data', data)
            )
        );
    }

    public sign(
        list: Array<TTransactionParamWithType>
    ): Promise<Array<TTransactionWithProofs<TLong> & IWithId>> {
        return this.login().then(() =>
            this._transport.dialog((bus) => bus.request('sign', list))
        );
    }
}
