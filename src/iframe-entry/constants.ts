import BigNumber from '@waves/bignumber';
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
    quantity: BigNumber.toBigNumber(100000000)
        .mul(Math.pow(10, 8))
        .toFixed(),
    issuer: 'WAVES',
    minSponsoredAssetFee: null,
};

export const NAME_MAP = {
    issue: 3 as 3,
    transfer: 4 as 4,
    reissue: 5 as 5,
    burn: 6 as 6,
    exchange: 7 as 7,
    lease: 8 as 8,
    cancelLease: 9 as 9,
    alias: 10 as 10,
    massTransfer: 11 as 11,
    data: 12 as 12,
    setScript: 13 as 13,
    sponsorship: 14 as 14,
    setAssetScript: 15 as 15,
    invoke: 16 as 16,
    updateAssetInfo: 17 as 17,
};

export const SPONSORED_TYPES: Array<TransactionType> = [
    NAME_MAP.transfer,
    NAME_MAP.invoke,
];
