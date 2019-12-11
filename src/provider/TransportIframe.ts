import { Transport } from './Transport';
import { TBus } from './interface';
import { Bus, WindowAdapter } from '@waves/waves-browser-bus';

export class TransportIframe extends Transport {
    private static _timer: ReturnType<typeof setTimeout> | null = null;
    private readonly _ready: Promise<TBus>;
    private readonly _iframe: HTMLIFrameElement;

    constructor(url: string, queueLength: number) {
        super(queueLength);
        this._iframe = TransportIframe._createIframe(url);
        this._ready = WindowAdapter.createSimpleWindowAdapter(
            this._iframe
        ).then((adapter) => {
            this._hideIframe();

            return new Bus(adapter, -1);
        });
        this._addIframeToDom();
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

    private static _createIframe(url: string): HTMLIFrameElement {
        const iframe = document.createElement('iframe');

        iframe.style.transition = 'opacity .2s';
        iframe.style.position = 'absolute';
        iframe.style.opacity = '0';
        iframe.src = url;

        return iframe;
    }

    public event(callback: (bus: TBus) => void): void {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._ready.then((bus) => {
            callback(bus);
        });
    }

    protected async getBus(): Promise<TBus> {
        return this._ready;
    }

    protected beforeShow(): void {
        this._showIframe();
    }

    protected afterShow(): void {
        this._hideIframe();
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

    private _applyStyle(styles: TWritableCSSStyleDeclaration): void {
        Object.entries(styles).forEach(([name, value]) => {
            if (value != null) {
                this._iframe.style[name] = value;
            }
        });
    }
}

type TWritableCSSStyleDeclaration = Partial<
    Pick<
        TFilterFunctions<TFilterNumberKeys<CSSStyleDeclaration>>,
        Exclude<keyof CSSStyleDeclaration, 'length' | 'parentRule'>
    >
>;

type TFilterNumberKeys<T extends Record<keyof unknown, unknown>> = {
    [Key in keyof T]: Key extends number ? never : T[Key];
};

type TNotFunction<T> = T extends (...args: Array<unknown>) => unknown
    ? never
    : T;

type TFilterFunctions<T extends Record<keyof unknown, unknown>> = {
    [Key in keyof T]: TNotFunction<T[Key]>;
};
