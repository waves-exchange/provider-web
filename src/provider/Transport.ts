import { Queue } from '../utils/Queue';
import { TBus, ITransport } from './interface';

export abstract class Transport implements ITransport {
    private readonly _queue: Queue;
    private readonly _events: Array<TEventDispatcher<void>> = [];

    constructor(queueLength: number) {
        this._queue = new Queue(queueLength);
    }

    public event(callback: TEventDispatcher<void>): void {
        this._events.push(callback);
    }

    public async dialog<T>(callback: TEventDispatcher<T>): Promise<T> {
        this._runBeforeShow();
        const bus = await this._getBus();
        const action = async (): Promise<T> => callback(bus);

        this._runEvents(bus);

        if (this._queue.canPush()) {
            try {
                const result = await this._queue.push(action);

                this._runAfterShow();

                return result;
            } catch (e) {
                this._runAfterShow();

                return Promise.reject(e);
            }
        } else {
            return Promise.reject(new Error('Queue is full!'));
        }
    }

    private _runBeforeShow(): void {
        if (this._queue.length === 0) {
            this._beforeShow();
        }
    }

    private _runAfterShow(): void {
        if (this._queue.length === 0) {
            this._afterShow();
        }
    }

    private _runEvents(bus: TBus): void {
        this._events
            .splice(0, this._events.length)
            .forEach((callback) => callback(bus));
    }

    protected abstract _beforeShow(): void;
    protected abstract _afterShow(): void;

    protected abstract _getBus(): Promise<TBus>;
}

type TEventDispatcher<T> = (bus: TBus) => Promise<T>;
