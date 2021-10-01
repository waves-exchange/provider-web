import { BigNumber } from '@waves/bignumber';
import { TransactionType } from '@waves/ts-types';

export const MAX_ALIAS_LENGTH = 30;

export const WAVES = {
    ticker: 'WAVES',
    assetId: 'WAVES',
    name: 'Waves',
    decimals: 8,
    description: '',
    issueHeight: 0,
    issueTimestamp: new Date('2016-04-11T21:00:00.000Z').getTime(),
    reissuable: false,
    scripted: false,
    minSponsoredFee: null,
    quantity: BigNumber.toBigNumber(100000000).mul(Math.pow(10, 8)).toFixed(),
    issuer: 'WAVES',
    minSponsoredAssetFee: null,
    logo: '',
};

export const NAME_MAP = {
    issue: 3 as const,
    transfer: 4 as const,
    reissue: 5 as const,
    burn: 6 as const,
    exchange: 7 as const,
    lease: 8 as const,
    cancelLease: 9 as const,
    alias: 10 as const,
    massTransfer: 11 as const,
    data: 12 as const,
    setScript: 13 as const,
    sponsorship: 14 as const,
    setAssetScript: 15 as const,
    invoke: 16 as const,
    updateAssetInfo: 17 as const,
};

export const SPONSORED_TYPES: Array<TransactionType> = [
    NAME_MAP.transfer,
    NAME_MAP.invoke,
];
