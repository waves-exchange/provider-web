import { MAX_ALIAS_LENGTH } from '../../constants';
import { IState } from '../interface';

export function fixRecipient(
    state: IState<unknown>
): <T extends { recipient: string }>(data: T) => T;
export function fixRecipient<T extends { recipient: string }>(
    state: IState<unknown>,
    data: T
): T;
export function fixRecipient<T extends { recipient: string }>(
    state: IState<unknown>,
    data?: T
): T | ((data: T) => T) {
    const apply = (data: T): T => {
        const origin = data.recipient.replace(/alias:.:/, '');

        if (origin.length > MAX_ALIAS_LENGTH) {
            return { ...data, recipient: origin };
        } else {
            return {
                ...data,
                recipient: `alias:${String.fromCharCode(
                    state.networkByte
                )}:${origin}`,
            };
        }
    };

    return data != null ? apply(data) : apply;
}
