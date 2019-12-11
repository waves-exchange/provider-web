import { IBusEvents, TBusHandlers } from '../interface';
import { Bus } from '@waves/waves-browser-bus';

export type TBus = Bus<IBusEvents, TBusHandlers>;
export interface ITransport {
    dialog<T>(callback: (bus: TBus) => Promise<T>): Promise<T>;
    event(callback: (bus: TBus) => unknown): void;
}
