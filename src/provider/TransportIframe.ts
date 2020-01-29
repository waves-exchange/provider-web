import { Transport } from './Transport';
import { TBus } from './interface';
import { Bus, WindowAdapter } from '@waves/waves-browser-bus';
import { CSSProperties } from 'react';
import { IEncryptedUserData } from '../interface';

export class TransportIframe extends Transport {
    private static _timer: ReturnType<typeof setTimeout> | null = null;
    private readonly _url: string;
    private readonly _activeBusCreate: Promise<TBus> | undefined;
    private _iframe: HTMLIFrameElement | undefined;
    private _bus: TBus | undefined;

    constructor(url: string, queueLength: number) {
        super(queueLength);
        this._url = url;
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

    private static _addIframeToDom(iframe: HTMLIFrameElement): void {
        if (document.body != null) {
            document.body.appendChild(iframe);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(iframe);
            });
        }
    }

    private static _createIframe(url: string): HTMLIFrameElement {
        const iframe = document.createElement('iframe');

        iframe.style.transition = 'opacity .2s';
        iframe.style.position = 'absolute';
        iframe.style.opacity = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.left = '0';
        iframe.style.top = '0';
        iframe.style.border = 'none';
        iframe.style.position = 'fixed';
        iframe.src = url;

        return iframe;
    }

    public getPublicKey(): Promise<string> {
        return this._getBus().then((bus) => bus.request('get-public-key'));
    }

    public setStorage(data: IEncryptedUserData): Promise<void> {
        return this._getBus()
            .then((bus) => bus.request('set-user-data', data))
            .then(() => this._hideIframe());
    }

    protected _dropTransportConnect(): void {
        if (this._iframe != null) {
            document.body.removeChild(this._iframe);
            this._iframe = undefined;
        }
        if (this._bus) {
            this._bus.destroy();
            this._bus = undefined;
        }
    }

    protected _getBus(): Promise<TBus> {
        if (this._bus) {
            return Promise.resolve(this._bus);
        }

        if (this._iframe == null) {
            this._iframe = TransportIframe._createIframe(this._url);
            TransportIframe._addIframeToDom(this._iframe);
        }

        return WindowAdapter.createSimpleWindowAdapter(this._iframe).then(
            (adapter) =>
                new Promise((resolve) => {
                    this._bus = new Bus(adapter, -1);
                    this._bus.once('ready', () => resolve(this._bus));
                })
        );
    }

    protected _beforeShow(): void {
        if (this._iframe == null) {
            this._iframe = TransportIframe._createIframe(this._url);
            TransportIframe._addIframeToDom(this._iframe);
        }
        this._showIframe();
    }

    protected _afterShow(): void {
        this._hideIframe();
    }

    private _showIframe(): void {
        const shownStyles: CSSProperties = {
            width: '100%',
            height: '100%',
            left: '0',
            top: '0',
            border: 'none',
            position: 'fixed',
            display: 'block',
            opacity: '0',
            zIndex: 99999999,
        };

        this._applyStyle(shownStyles);
        if (TransportIframe._timer != null) {
            clearTimeout(TransportIframe._timer);
        }
        TransportIframe._timer = setTimeout(() => {
            this._applyStyle({ opacity: '1' });
        }, 0);
    }

    private _hideIframe(): void {
        const hiddenStyle = {
            opacity: '0',
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
                opacity: '0',
                zIndex: 0,
                display: 'none',
            });
        }, 200);
    }

    private _applyStyle(styles: CSSProperties): void {
        Object.entries(styles).forEach(([name, value]) => {
            if (value != null) {
                this._iframe!.style[name] = value;
            }
        });
    }
}
