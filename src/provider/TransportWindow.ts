import { Transport } from './Transport';
import { TransportIframe } from './TransportIframe';
import { TBus } from './interface';
import { Bus, WindowAdapter } from '@waves/waves-browser-bus';

export class TransportWindow extends Transport {
    private readonly _url: string;
    private readonly _iframeTransport: TransportIframe;
    private _activeBusData: { win: Window; bus: TBus } | undefined;
    private _useTransportChanged = false;

    constructor(url: string, queueLength: number) {
        super(queueLength);
        this._iframeTransport = new TransportIframe(url, queueLength);
        this._url = url;
    }

    public dialog<T>(callback: (bus: TBus) => Promise<T>): Promise<T> {
        if (this._useTransportChanged) {
            return this._iframeTransport.dialog(callback);
        }

        const wrapper = (bus: TBus): Promise<T> => {
            if (this._useTransportChanged) {
                return this._iframeTransport.dialog(callback);
            }

            return new Promise((resolve, reject) => {
                if (this._useTransportChanged) {
                    return this._iframeTransport.dialog(callback);
                }

                if (this._activeBusData?.win.closed) {
                    return reject(new Error('User rejection!'));
                }

                bus.once('close', () => {
                    reject(new Error('User rejection!'));
                });

                return callback(bus).then((result) => {
                    return this._changeTransport(bus).then(() =>
                        resolve(result)
                    );
                }, reject);
            });
        };

        return super.dialog(wrapper);
    }

    protected _beforeShow(): void {
        return void 0;
    }

    protected _afterShow(): void {
        if (this._activeBusData != null) {
            this._activeBusData.win.close();
            this._activeBusData.bus.destroy();
            this._activeBusData = undefined;
            window.focus();
        }
    }

    protected _getBus(): Promise<TBus> {
        if (this._activeBusData != null) {
            return Promise.resolve(this._activeBusData.bus);
        }

        const win = window.open(this._url);
        const origins = new URL('', this._url).origin;

        if (win == null) {
            throw new Error('Method must be called in user event!');
        }

        return WindowAdapter.createSimpleWindowAdapter(win, {
            origins,
        }).then((adapter) => {
            const bus = new Bus(adapter, -1);

            this._activeBusData = { win, bus };

            return new Promise((resolve) => {
                bus.once('ready', () => resolve(bus));
            });
        });
    }

    protected _dropTransportConnect(): void {
        this._useTransportChanged = false;
        this._iframeTransport.dropConnection();
        this._afterShow();
    }

    private _changeTransport(bus: TBus): Promise<void> {
        return this._iframeTransport
            .getPublicKey()
            .then((publicKey) => bus.request('get-user-data', publicKey))
            .then((data) => this._iframeTransport.setStorage(data))
            .then(() => this._afterShow())
            .then(() => {
                this._useTransportChanged = true;
            });
    }
}
