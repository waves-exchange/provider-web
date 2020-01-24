import { Transport } from './Transport';
import { TransportIframe } from './TransportIframe';
import { TBus } from './interface';
import { Bus, WindowAdapter } from '@waves/waves-browser-bus';

export class TransportWindow extends Transport {
    private readonly _url: string;
    private readonly _iframeTransport: TransportIframe;
    private _active: { win: Window; bus: TBus; closed: boolean } | undefined;
    private _transportChanged = false;

    constructor(url: string, queueLength: number) {
        super(queueLength);
        this._iframeTransport = new TransportIframe(url, queueLength);
        this._url = url;
    }

    public dialog<T>(callback: (bus: TBus) => Promise<T>): Promise<T> {
        if (this._transportChanged) {
            return this._iframeTransport.dialog(callback);
        }

        const wrapper = (bus: TBus): Promise<T> => {
            if (this._transportChanged) {
                return this._iframeTransport.dialog(callback);
            }

            return new Promise((resolve, reject) => {
                if (this._transportChanged) {
                    return this._iframeTransport.dialog(callback);
                }

                if (this._active?.closed) {
                    return reject(new Error('User rejection!'));
                }

                bus.once('close', () => {
                    this._active!.closed = true;
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
        if (this._active != null) {
            this._active.win.close();
            this._active.bus.destroy();
            this._active = undefined;
            window.focus();
        }
    }

    protected _getBus(): Promise<TBus> {
        if (this._active != null) {
            return Promise.resolve(this._active.bus);
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

            this._active = { win, bus, closed: false };

            return new Promise((resolve) => {
                bus.once('ready', () => resolve(bus));
            });
        });
    }

    protected _dropTransportConnect(): void {
        this._transportChanged = false;
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
                this._transportChanged = true;
            });
    }
}
