import { ITransport } from './interface';
import { IBusEvents, TBusHandlers } from '../interface';
import { Bus, WindowAdapter } from '@waves/waves-browser-bus';


export class TransportWindow implements ITransport {

    private readonly _url: string;
    private _messageCallback: undefined | ((bus: Bus<IBusEvents, TBusHandlers>) => unknown);


    constructor(url: string, cacheKill: boolean) {
        this._url = new URL(cacheKill ? `?${Date.now()}` : '', url).toString();
    }

    public sendMessage(callback: (bus: Bus<IBusEvents, TBusHandlers>) => Promise<any>): void {
        this._messageCallback = callback;
    }

    public showDialog<T>(callback: (bus: Bus<IBusEvents, TBusHandlers>) => Promise<T>): Promise<T> {
        const win = window.open(this._url);
        const origin = new URL('', this._url).origin;
        if (!win) {
            throw new Error('Browser is block open new window! Try repeat in user click event!');
        }
        return WindowAdapter.createSimpleWindowAdapter(win, { origins: origin }).then(adapter => {
            return new Promise(resolve => {
                const bus = new Bus(adapter, -1);
                bus.once('ready', () => {
                    const ready = this._messageCallback ? Promise.resolve(this._messageCallback(bus)) : Promise.resolve();
                    return ready.then(() => callback(bus))
                        .then(response => {
                            win.close();
                            return response;
                        })
                        .then(resolve);
                });
            });
        });
    }
}
