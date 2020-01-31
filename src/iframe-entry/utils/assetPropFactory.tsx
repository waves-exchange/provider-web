import { DetailsWithLogo } from './loadLogoInfo';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { TLong } from '@waves/signer';
import { isNil, prop } from 'ramda';
import { WAVES } from '../constants';

type GetAssetProp = <P extends keyof DetailsWithLogo>(
    id: string | null,
    property: P
) => DetailsWithLogo[P];

export const assetPropFactory = (
    assets: Record<string, TAssetDetails<TLong>>
): GetAssetProp => <P extends keyof DetailsWithLogo>(
    assetId: string | null,
    property: P
): DetailsWithLogo[P] =>
    isNil(assetId)
        ? prop<P, DetailsWithLogo>(property, WAVES)
        : prop<P, DetailsWithLogo>(property, assets[assetId]);
