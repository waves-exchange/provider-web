import { DetailsWithLogo } from './loadLogoInfo';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { isNil, prop } from 'ramda';
import { WAVES } from '../constants';
import { Long } from '@waves/ts-types';

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
        ? prop<P, DetailsWithLogo>(property, WAVES)
        : prop<P, DetailsWithLogo>(property, assets[assetId]);
