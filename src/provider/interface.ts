import { IBusEvents, TBusHandlers } from '../interface';
import { Bus } from '@waves/waves-browser-bus';


export interface ITransport {
    sendMessage(callback: (bus: Bus<IBusEvents, TBusHandlers>) => any): void;
    showDialog<T>(callback: (bus: Bus<IBusEvents, TBusHandlers>) => Promise<T>): Promise<T>;
}
