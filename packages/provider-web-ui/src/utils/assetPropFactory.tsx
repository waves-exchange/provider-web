import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { Long } from '@waves/ts-types';
import { isNil, prop } from 'ramda';
import { DetailsWithLogo } from '../interface';
import { WAVES } from '../constants';

type GetAssetProp = <P extends keyof DetailsWithLogo>(
    id: string | null,
    property: P
) => DetailsWithLogo[P];

export const assetPropFactory = (
    assets: Record<string, TAssetDetails<Long>>
): GetAssetProp => <P extends keyof DetailsWithLogo>(
    assetId: string | null,
    property: P
): DetailsWithLogo[P] =>
    isNil(assetId)
        ? prop<P, DetailsWithLogo>(property, WAVES as any)
        : prop<P, DetailsWithLogo>(property, assets[assetId]);
