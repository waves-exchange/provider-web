export const middlewareWithContext = <
    CONTEXT,
    ARGUMENT,
    RETURN extends Promise<unknown>
>(
    ...mw: Array<TMiddleware<CONTEXT, ARGUMENT, RETURN>>
): ((ctx: CONTEXT) => (arg: ARGUMENT) => RETURN) => (ctx) => (arg): RETURN => {
    const list = mw.slice().reverse();

    if (!list.length) {
        throw new Error('Middlewares is empty!');
    }

    return new Promise((resolve, reject) => {
        const loop = (mw: TMiddleware<CONTEXT, ARGUMENT, RETURN>) => {
            let wasCallNext = false;
            const next = () => {
                wasCallNext = true;
                if (list.length) {
                    loop(list.pop()!);
                } else {
                    throw new Error('Has no next middleware!');
                }
            };

            const tmp = mw(ctx, arg, next);

            if (!wasCallNext) {
                resolve(tmp);
            }
        };

        loop(list.pop()!);
    }) as any;
};

type NEXT = () => void;
export type TMiddleware<CONTEXT, ARGUMENT, R> = (
    ctx: CONTEXT,
    argument: ARGUMENT,
    next: NEXT
) => R;
