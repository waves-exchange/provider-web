import { TLong } from '@waves/waves-js/dist/src/interface';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { fetchDataKey } from '@waves/node-api-js/es/api-node/addresses';
import curry from 'ramda/es/curry';

const BETTER_TOKENS_MAP = {
    W: '3P6t5mKGwVDkyjFhtUqw4NnecyC3DRpLfkw',
    T: '3N5net4nzSeeqxPfGZrvVvnGavsinipQHbE',
};

const getBetterTokensAddress = (networkByte: number): string | null => {
    const chainId = String.fromCharCode(networkByte);

    if (BETTER_TOKENS_MAP[chainId] !== null) {
        return BETTER_TOKENS_MAP[chainId];
    } else {
        return null;
    }
};

export const loadLogoInfo = curry(
    (
        base: string,
        networkByte: number,
        data: Array<TAssetDetails<TLong>>
    ): Promise<Array<DetailsWithLogo>> =>
        Promise.all(
            data.map((asset) => {
                const address = getBetterTokensAddress(networkByte);

                return address != null
                    ? fetchDataKey(base, address, `logo_<${asset.assetId}>`)
                          .then((entry) => ({ ...asset, logo: entry.value }))
                          .catch(() => asset)
                    : asset;
            })
        )
);

export type DetailsWithLogo = TAssetDetails<TLong> & {
    logo?: string;
};
