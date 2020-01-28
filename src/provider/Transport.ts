import { Queue } from '../utils/Queue';
import { TBus, ITransport } from './interface';

export abstract class Transport implements ITransport {
    private readonly _queue: Queue;
    private readonly _events: Array<TEventDispatcher<void>> = [];

    constructor(queueLength: number) {
        this._queue = new Queue(queueLength);
    }

    public dropConnection(): void {
        this._queue.clear(new Error('User rejection!'));
        this._dropTransportConnect();
    }

    public sendEvent(callback: TEventDispatcher<void>): void {
        this._events.push(callback);
    }

    public dialog<T>(callback: TEventDispatcher<T>): Promise<T> {
        this._runBeforeShow();

        return this._getBus().then((bus) => {
            const action = (): Promise<T> => callback(bus);

            this._runEvents(bus);

            if (this._queue.canPush()) {
                return this._queue
                    .push(action)
                    .then((result) => {
                        this._runAfterShow();

                        return result;
                    })
                    .catch((error) => {
                        this._runAfterShow();

                        return Promise.reject(error);
                    });
            } else {
                return Promise.reject(new Error('Queue is full!'));
            }
        });
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

    protected abstract _dropTransportConnect(): void;
    protected abstract _beforeShow(): void;
    protected abstract _afterShow(): void;

    protected abstract _getBus(): Promise<TBus>;
}

type TEventDispatcher<T> = (bus: TBus) => Promise<T>;
