export function catchable<T extends (args: Array<any>) => any>(
    func: T
): (...args: Parameters<T>) => TResult<ReturnType<T>> {
    return (...args: Parameters<T>) => {
        try {
            const resolveData = (func as any)(...args); // TODO
            return { ok: true, resolveData, rejectData: null };
        } catch (e) {
            return { ok: false, resolveData: null, rejectData: e };
        }
    }
}

type TResult<T, R extends Error = Error> = {
    ok: true;
    resolveData: T;
    rejectData: null;
} | {
    ok: false;
    resolveData: null;
    rejectData: R;
}
