import { IBusEvents, TBusHandlers } from '../interface';
import { Bus } from '@waves/waves-browser-bus';

export type TBus = Bus<IBusEvents, TBusHandlers>;
export interface ITransport<T> {
    get(): T;
    dialog<T>(callback: (bus: TBus) => Promise<T>): Promise<T>;
    sendEvent(callback: (bus: TBus) => unknown): void;
    dropConnection(): void;
}
