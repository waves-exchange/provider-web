import {
    TRANSACTION_NAME_MAP,
    TRANSACTION_TYPE_MAP,
} from '@waves/waves-js/dist/src/interface';
import { TTransactionType } from '@waves/ts-types';
import BigNumber from '@waves/bignumber';

export const TYPE_MAP: TRANSACTION_TYPE_MAP = {
    3: 'issue',
    4: 'transfer',
    5: 'reissue',
    6: 'burn',
    7: 'exchange',
    8: 'lease',
    9: 'cancelLease',
    10: 'alias',
    11: 'massTransfer',
    12: 'data',
    13: 'setScript',
    14: 'sponsorship',
    15: 'setAssetScript',
    16: 'invoke',
};

export const NAME_MAP: TRANSACTION_NAME_MAP = {
    issue: 3,
    transfer: 4,
    reissue: 5,
    burn: 6,
    exchange: 7,
    lease: 8,
    cancelLease: 9,
    alias: 10,
    massTransfer: 11,
    data: 12,
    setScript: 13,
    sponsorship: 14,
    setAssetScript: 15,
    invoke: 16,
};

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

export const MAX_ALIAS_LENGTH = 30;
export const SPONSORED_TYPES: Array<TTransactionType> = [NAME_MAP.transfer];
