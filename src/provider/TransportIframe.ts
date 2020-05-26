import { Bus, WindowAdapter } from '@waves/waves-browser-bus';
import { CSSProperties } from 'react';
import { renderErrorPage } from '../iframe-entry/utils/renderErrorPage';
import { TBus } from './interface';
import { Transport } from './Transport';

export class TransportIframe extends Transport<HTMLIFrameElement> {
    private static _timer: ReturnType<typeof setTimeout> | null = null;
    private readonly _url: string;
    private _iframe: HTMLIFrameElement | undefined;
    private _bus: TBus | undefined;

    constructor(url: string, queueLength: number) {
        super(queueLength);
        this._url = url;
        this._initIframe();
    }

    public get(): HTMLIFrameElement {
        if (!this._iframe) {
            this._initIframe();
        }

        return this._iframe as HTMLIFrameElement;
    }

    protected _dropTransportConnect(): void {
        if (this._iframe != null) {
            document.body.removeChild(this._iframe);
            this._initIframe();
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

        return WindowAdapter.createSimpleWindowAdapter(this._iframe).then(
            (adapter) =>
                new Promise((resolve) => {
                    this._bus = new Bus(adapter, -1);
                    this._bus.once('ready', () => {
                        resolve(this._bus);
                    });
                })
        );
    }

    protected _beforeShow(): void {
        this._showIframe();
    }

    protected _afterShow(): void {
        this._hideIframe();
    }

    private _initIframe(): void {
        this._iframe = this._createIframe();
        this._addIframeToDom(this._iframe);
        this._listenFetchURLError(this._iframe);
        this._hideIframe();
    }

    private _addIframeToDom(iframe: HTMLIFrameElement): void {
        if (document.body != null) {
            document.body.appendChild(iframe);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(iframe);
            });
        }
    }

    private _createIframe(): HTMLIFrameElement {
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

        return iframe;
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

    private _listenFetchURLError(iframe: HTMLIFrameElement): void {
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
