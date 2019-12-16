import { MAX_ALIAS_LENGTH } from '../../constants';
import curry from 'ramda/es/curry';

export const fixRecipient = curry(
    <T extends { recipient: string }>(networkByte: number, data: T): T => {
        const origin = data.recipient.replace(/alias:.:/, '');

        if (origin.length > MAX_ALIAS_LENGTH) {
            return { ...data, recipient: origin };
        } else {
            return {
                ...data,
                recipient: `alias:${String.fromCharCode(
                    networkByte
                )}:${origin}`,
            };
        }
    }
);
