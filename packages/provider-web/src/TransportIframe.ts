import { Bus, WindowAdapter } from '@waves/waves-browser-bus';
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
                        resolve(this._bus as TBus);
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
        const shownStyles: Partial<CSSStyleDeclaration> = {
            width: '100%',
            height: '100%',
            left: '0',
            top: '0',
            border: 'none',
            position: 'fixed',
            display: 'block',
            opacity: '0',
            zIndex: '99999999',
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
                zIndex: '0',
                display: 'none',
            });
        }, 200);
    }

    private _applyStyle(styles: Partial<CSSStyleDeclaration>): void {
        Object.entries(styles).forEach(([name, value]) => {
            if (value != null) {
                if (this._iframe) {
                    this._iframe.style[name] = value;
                }
            }
        });
    }

    private _renderErrorPage(
        bodyElement: HTMLElement,
        onClose: () => void,
        errorMessage: string
    ): void {
        if (bodyElement.parentElement) {
            bodyElement.parentElement.style.height = '100%';
        }

        Object.assign(bodyElement.style, {
            position: 'relative',
            boxSizing: 'border-box',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0px',
        } as Partial<CSSStyleDeclaration>);

        const backdropElement = document.createElement('div');

        Object.assign(backdropElement.style, {
            position: 'fixed',
            zIndex: '-1',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#000',
            opacity: '0.6',
        } as Partial<CSSStyleDeclaration>);

        const wrapperElement = document.createElement('div');

        Object.assign(wrapperElement.style, {
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            margin: '0',
            backgroundColor: '#292F3C',
            width: '520px',
            borderRadius: '6px',
            padding: '40px',
            boxSizing: 'border-box',
        } as Partial<CSSStyleDeclaration>);

        const errorMessageElement = document.createElement('div');

        errorMessageElement.textContent = errorMessage;

        Object.assign(errorMessageElement.style, {
            fontSize: '15px',
            lineHeight: '20px',
            color: '#fff',
            marginBottom: '40px',
            fontFamily: 'Roboto, sans-serif',
        } as Partial<CSSStyleDeclaration>);

        const buttonElement = document.createElement('button');

        buttonElement.textContent = 'OK';
        buttonElement.addEventListener('click', () => onClose());

        Object.assign(buttonElement.style, {
            width: '100%',
            fontSize: '15px',
            lineHeight: '48px',
            padding: ' 0 40px',
            color: '#fff',
            backgroundColor: '#5A81EA',
            outline: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Roboto, sans-serif',
            borderRadius: '4px',
        } as Partial<CSSStyleDeclaration>);

        wrapperElement.appendChild(errorMessageElement);
        wrapperElement.appendChild(buttonElement);

        bodyElement.appendChild(backdropElement);
        bodyElement.appendChild(wrapperElement);
    }

    private _listenFetchURLError(iframe: HTMLIFrameElement): void {
        fetch(this._url).catch(() => {
            iframe.addEventListener('load', () => {
                if (!iframe.contentDocument) {
                    return;
                }

                this._renderErrorPage(
                    iframe.contentDocument.body,
                    () => this.dropConnection(),
                    'The request could not be processed. To resume your further work, disable the installed plugins.'
                );
                this._showIframe();
            });
        });
    }
}

export function isBrave(): boolean {
    return !!(navigator as any).brave?.isBrave;
}

export function isSafari(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafariUA =
        userAgent.includes('safari') && !userAgent.includes('chrome');
    const iOS =
        navigator.platform != null &&
        /iPad|iPhone|iPod/.test(navigator.platform);

    return iOS || isSafariUA;
}
