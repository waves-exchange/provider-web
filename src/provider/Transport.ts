import { Queue } from '../utils/Queue';
import { TBus, ITransport } from './interface';

export abstract class Transport implements ITransport {
    private readonly queue: Queue;

    constructor(queueLength: number) {
        this.queue = new Queue(queueLength);
    }

    public async dialog<T>(callback: (bus: TBus) => Promise<T>): Promise<T> {
        this.runBeforeShow();
        const bus = await this.getBus();

        const action = async (): Promise<T> => callback(bus);

        if (this.queue.canPush()) {
            try {
                const result = await this.queue.push(action);

                this.runAfterShow();

                return result;
            } catch (e) {
                this.runAfterShow();

                return Promise.reject(e);
            }
        } else {
            return Promise.reject(new Error('Queue is full!'));
        }
    }

    private runBeforeShow(): void {
        if (this.queue.length === 0) {
            this.beforeShow();
        }
    }

    private runAfterShow(): void {
        if (this.queue.length === 0) {
            this.afterShow();
        }
    }

    public abstract event(callback: (data: TBus) => void): void;

    protected abstract beforeShow(): void;
    protected abstract afterShow(): void;

    protected abstract getBus(): Promise<TBus>;
}
