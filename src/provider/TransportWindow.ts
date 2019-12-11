import { Transport } from './Transport';
import { TBus } from './interface';
import { Bus, WindowAdapter } from '@waves/waves-browser-bus';

export class TransportWindow extends Transport {
    private readonly _url: string;
    private _messageCallback: undefined | ((bus: TBus) => unknown);
    private _active: { win: Window; bus: TBus } | undefined;

    constructor(url: string, queueLength: number) {
        super(queueLength);
        this._url = url;
    }

    public event(callback: (bus: TBus) => void): void {
        this._messageCallback = callback;
    }

    protected beforeShow(): void {
        return void 0;
    }

    protected afterShow(): void {
        if (this._active != null) {
            this._active.win.close();
            this._active.bus.destroy();
        }
        this._active = undefined;
    }

    protected async getBus(): Promise<TBus> {
        if (this._active != null) {
            return Promise.resolve(this._active.bus);
        }

        const win = window.open(this._url);
        const origins = new URL('', this._url).origin;

        if (win == null) {
            throw new Error('Method must be called in user event!');
        }

        const adapter = await WindowAdapter.createSimpleWindowAdapter(win, {
            origins,
        });

        const bus = new Bus(adapter, -1);

        this._active = { win, bus };

        return new Promise((resolve) => {
            bus.once('ready', () => {
                if (this._messageCallback != null) {
                    this._messageCallback(bus);
                }
                resolve();
            });
        });
    }
}
