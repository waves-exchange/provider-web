import { IQueue, Queue } from './Queue';
import { TBus, ITransport } from './interface';

export abstract class Transport<T> implements ITransport<T> {
    private readonly _queue: IQueue;
    private readonly _events: Array<TEventDispatcher<void>> = [];
    private readonly _toRunEvents: Array<TEventDispatcher<void>> = [];

    constructor(queueLength: number) {
        this._queue = new Queue(queueLength);
    }

    public dropConnection(): void {
        this._queue.clear(new Error('User rejection!'));
        this._events.forEach((event) => this._toRunEvents.push(event));
        this._dropTransportConnect();
    }

    public sendEvent(callback: TEventDispatcher<void>): void {
        this._events.push(callback);
        this._toRunEvents.push(callback);
    }

    public dialog<T>(callback: TEventDispatcher<T>): Promise<T> {
        this._runBeforeShow();

        return this._getBus().then((bus) => {
            const action = this._wrapAction((): Promise<T> => callback(bus));

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
        this._toRunEvents
            .splice(0, this._events.length)
            .forEach((callback) => callback(bus));
    }

    private _wrapAction<T>(action: () => Promise<T>): () => Promise<T> {
        return this._toRunEvents
            ? (): Promise<T> => {
                  const result = action();

                  result.catch(() => {
                      this._events.forEach((event) =>
                          this._toRunEvents.push(event)
                      );
                  });

                  return result;
              }
            : action;
    }

    public abstract get(): T;
    protected abstract _dropTransportConnect(): void;
    protected abstract _beforeShow(): void;
    protected abstract _afterShow(): void;
    protected abstract _getBus(): Promise<TBus>;
}

type TEventDispatcher<T> = (bus: TBus) => Promise<T>;
