export class Queue {
    public get length(): number {
        return this.actions.length + (this.active == null ? 0 : 1);
    }
    private readonly actions: Array<() => Promise<void>> = [];
    private readonly maxLength: number;
    private active: Promise<void> | undefined;

    constructor(maxLength: number) {
        this.maxLength = maxLength;
    }

    public async push<T>(action: () => Promise<T>): Promise<T> {
        if (this.actions.length >= this.maxLength) {
            throw new Error("Cant't push action! Queue is full!");
        }

        return new Promise((resolve, reject) => {
            this.actions.push(async () =>
                action().then((data) => resolve(data), reject)
            );

            if (this.length === 1) {
                this.run();
            }
        });
    }

    public canPush(): boolean {
        return this.actions.length < this.maxLength;
    }

    private run(): void {
        const action = this.actions.shift();

        if (action == null) {
            return void 0;
        }

        this.active = action();

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.active.finally(() => {
            this.active = undefined;
            const index = this.actions.indexOf(action);

            if (index !== -1) {
                this.actions.splice(index, 1);
            }

            this.run();
        });
    }
}
