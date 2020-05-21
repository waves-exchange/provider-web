import { Transport } from './Transport';
import { TBus } from './interface';
import { Bus, WindowAdapter } from '@waves/waves-browser-bus';
import { CSSProperties } from 'react';
import { IEncryptedUserData } from '../interface';
import { renderErrorPage } from '../iframe-entry/utils/renderErrorPage';

export class TransportIframe extends Transport {
    private static _timer: ReturnType<typeof setTimeout> | null = null;
    private readonly _url: string;
    private _activeBusData:
        | { iframe: HTMLIFrameElement; bus: TBus }
        | undefined;

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
        if (this._activeBusData != null) {
            document.body.removeChild(this._activeBusData.iframe);
            this._activeBusData.bus.destroy();
            this._activeBusData = undefined;
        }
    }

    protected async _getBus(): Promise<TBus> {
        if (this._activeBusData) {
            return Promise.resolve(this._activeBusData.bus);
        }

        const iframe = TransportIframe._createIframe(this._url);

        this._listenFetchURLError(iframe);

        TransportIframe._addIframeToDom(iframe);

        return WindowAdapter.createSimpleWindowAdapter(iframe).then(
            (adapter) =>
                new Promise((resolve) => {
                    const bus = new Bus(adapter, -1);

                    bus.once('ready', () => resolve(bus));
                    this._activeBusData = { iframe, bus };
                })
        );
    }

    protected _beforeShow(): void {
        if (this._activeBusData == null) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this._getBus().then(() => {
                this._showIframe();
            });
        } else {
            this._showIframe();
        }
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
                this._activeBusData!.iframe!.style[name] = value;
            }
        });
    }

    private _renderErrorPage(
        element: HTMLElement,
        onClose: () => void,
        error: string
    ): void {
        element.style.position = 'relative';
        element.style.boxSizing = 'border-box';
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.display = 'flex';
        element.style.justifyContent = 'center';
        element.style.alignItems = 'center';
        element.style.margin = '0px';
        renderErrorPage(element, onClose, error);
    }

    private _listenFetchURLError(iframe: HTMLIFrameElement) {
        fetch(this._url).catch(() => {
            iframe.addEventListener('load', () => {
                this._renderErrorPage(
                    iframe!.contentDocument!.body,
                    this.dropConnection.bind(this),
                    'The request could not be processed. To resume your further work, disable the installed plugins.'
                );
                this._showIframe();
            });
        });
    }
}
