import { TLong } from '@waves/signer';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { WAVES } from '../constants';
import { getPrintableNumber } from './math';

export const toArray = <T>(data: T | Array<T>): Array<T> =>
    Array.isArray(data) ? data : [data];

export function toFormat(
    num: TLong,
    id: string | null,
    hash: Record<string, TAssetDetails>
): string {
    const asset = id != null ? hash[id] : WAVES;

    if (asset == null) {
        throw new Error('Asset not found!');
    }

    return `${getPrintableNumber(num, asset.decimals)} ${asset.name}`;
}
