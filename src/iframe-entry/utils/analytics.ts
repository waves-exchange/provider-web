// TODO copy&pasted from waves.exchange
// @ts-nocheck
/* eslint-disable */

export const onContentLoad = new Promise((resolve) => {
    document.addEventListener('DOMContentLoaded', resolve);
});

export function loadScript(url: string) {
    return onContentLoad.then(
        () =>
            new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.addEventListener('load', resolve);
                script.addEventListener('error', reject);
                script.src = url;
                document.head.appendChild(script);
            })
    );
}

export function hasScript(url) {
    return !!document.querySelector('script[src="' + url + '"]');
}

export function runByPath(path, args) {
    let obj = window;
    const parts = path.split('.');
    const isFunc = obj[path] && typeof obj[path] === 'function';
    if (parts.length === 1 && isFunc) {
        return (obj[path] as any).apply(obj, args);
    }

    parts.slice(-1).forEach(function(part) {
        obj = obj[part] as any;
    });

    if (
        obj[parts[parts.length - 1]] &&
        typeof obj[parts[parts.length - 1]] === 'function'
    ) {
        (obj[parts[parts.length - 1]] as any).apply(obj, args);
    }
}

type TTargetTypes = 'all' | 'ui' | 'logic';

export interface IEventData {
    name: string;
    params?: any;
    target?: TTargetTypes;
}

interface IApiData {
    apiToken?: string;
    libraryUrl: string;
    initializeMethod: string;
    initializeOptions?: any;
    sendMethod: string;
    type: TTargetTypes;
}

interface IAdapter {
    send: (...args: any) => void;
    type: TTargetTypes;
}

class Analytics {
    static instance: Analytics;

    protected loaded: Promise<Array<Boolean>> | null;
    protected events = [];
    protected apiList: Array<IApiData> = [];
    protected readonly defaultParams: Record<string, any> = Object.create(null);
    protected isActive: boolean = false;
    protected isActivated: boolean = false;
    protected apiReadyList: Array<IAdapter> = [];

    constructor() {
        if (Analytics.instance) {
            return Analytics.instance;
        }
        Analytics.instance = this;
    }

    public init(defaultParams: Record<string, any>): void {
        Object.assign(this.defaultParams, defaultParams);
    }

    public addApi(data: IApiData) {
        this.apiList.push(data);
    }

    public addDefaultParams(params: Record<string, any>): void {
        Object.assign(this.defaultParams, params);
    }

    public deactivate(): void {
        this.isActive = false;
    }

    public activate() {
        if (!this.isActivated) {
            const apiLoadList = this.apiList.map((item) => {
                return loadScript(item.libraryUrl)
                    .then(() => {
                        runByPath(item.initializeMethod, [
                            item.apiToken,
                            item.initializeOptions,
                        ]);
                    })
                    .then(() => {
                        this.apiReadyList.push({
                            type: item.type,
                            send: function(name, params) {
                                runByPath(item.sendMethod, [name, params]);
                            },
                        });
                        return true;
                    })
                    .catch(() => {
                        console.error('Invalid analytics config', item);
                        return false;
                    });
            });

            this.loaded = Promise.all(apiLoadList);
        }

        this.loaded.then(() => {
            const events = [...this.events];
            this.events = [];
            events.forEach((event) => this._sendEvent(event));
            this.isActive = true;
        });

        this.isActivated = true;
    }

    public send(data: IEventData) {
        const event = {
            ...data,
            params: {
                ...this.defaultParams,
                ...data.params,
            },
        };

        if (this.isActive && this.isActivated) {
            this._sendEvent(event);
        } else {
            this.events.push(event);
        }
    }

    protected _sendEvent(data: IEventData) {
        if (!data.name) {
            throw new Error('Wrong format, has no event name!');
        }

        const type = data.target || 'all';

        this.apiReadyList
            .filter(function(item) {
                return type === 'all' ? true : item.type === type;
            })
            .forEach(function(item) {
                return item.send(data.name, { ...data.params });
            });
    }
}

export const analytics = new Analytics();

/* eslint-enable */
