import { ITransport } from './interface';
import { IBusEvents, TBusHandlers } from '../interface';
import { Bus, WindowAdapter } from '@waves/waves-browser-bus';

export class TransportIframe implements ITransport {
    private readonly _ready: Promise<Bus<IBusEvents, TBusHandlers>>;
    private readonly _iframe: HTMLIFrameElement;
    private static _timer: ReturnType<typeof setTimeout> | null = null;

    constructor(url: string, cacheKill: boolean) {
        this._iframe = TransportIframe._createIframe(url, cacheKill);
        this._ready = WindowAdapter.createSimpleWindowAdapter(
            this._iframe
        ).then((adapter) => {
            this._hideIframe();

            return new Bus(adapter, -1);
        });
        this._addIframeToDom();
    }

    public sendMessage<T>(
        callback: (bus: Bus<IBusEvents, TBusHandlers>) => Promise<T>
    ): Promise<T> {
        return this._ready.then((bus) => callback(bus));
    }

    public showDialog<T>(
        callback: (bus: Bus<IBusEvents, TBusHandlers>) => Promise<T>
    ): Promise<T> {
        return this._ready
            .then((bus) => {
                this._showIframe();

                return callback(bus);
            })
            .then((data) => {
                this._hideIframe();

                return data;
            })
            .catch((e) => {
                this._hideIframe();

                return Promise.reject(e);
            });
    }

    public static canUse(): boolean {
        const userAgent = navigator.userAgent.toLowerCase();
        const isSafari =
            userAgent.includes('safari') && !userAgent.includes('chrome');
        const iOS =
            navigator.platform != null &&
            /iPad|iPhone|iPod/.test(navigator.platform);

        return !(iOS || isSafari);
    }

    private _addIframeToDom(): void {
        if (document.body != null) {
            document.body.appendChild(this._iframe);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(this._iframe);
            });
        }
    }

    private _showIframe(): void {
        const shownStyles = {
            width: '100%',
            height: '100%',
            left: '0',
            top: '0',
            border: 'none',
            position: 'fixed',
            display: 'block',
            opacity: 0,
            zIndex: 99999999,
        };

        this._applyStyle(shownStyles);
        if (TransportIframe._timer != null) {
            clearTimeout(TransportIframe._timer);
        }
        TransportIframe._timer = setTimeout(() => {
            this._applyStyle({ opacity: 1 });
        }, 0);
    }

    private _hideIframe() {
        const hiddenStyle = {
            opacity: 0,
        };

        this._applyStyle(hiddenStyle);
        if (TransportIframe._timer != null) {
            clearTimeout(TransportIframe._timer);
        }
        TransportIframe._timer = setTimeout(() => {
            this._applyStyle({
                width: '10px',
                height: '10px',
                left: '-100px',
                top: '-100px',
                position: 'absolute',
                opacity: 0,
                zIndex: 0,
                display: 'none',
            });
        }, 200);
    }

    private _applyStyle(styles: object) {
        Object.keys(styles).forEach((name: string) => {
            const value = String(styles[name]);

            this._iframe.style[name as any] = value; // TODO Fix any
        });
    }

    private static _createIframe(
        url: string,
        cacheKill: boolean
    ): HTMLIFrameElement {
        const iframe = document.createElement('iframe');

        iframe.style.transition = 'opacity .2s';
        iframe.src = new URL(cacheKill ? `?${Date.now()}` : '', url).toString();

        return iframe;
    }
}
