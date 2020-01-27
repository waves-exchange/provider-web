import curry from 'ramda/es/curry';
import { cleanAddress } from './cleanAlias';
import { isAddress } from './isAddress';

export const fixRecipient = curry(
    <T extends { recipient: string }>(networkByte: number, data: T): T => {
        const address = cleanAddress(data.recipient);

        if (isAddress(address)) {
            return { ...data, recipient: address };
        } else {
            return {
                ...data,
                recipient: `alias:${String.fromCharCode(
                    networkByte
                )}:${address}`,
            };
        }
    }
);
