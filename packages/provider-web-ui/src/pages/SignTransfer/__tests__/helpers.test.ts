import { AssetDecimals, Long, MassTransferItem } from '@waves/ts-types';
import { NAME_MAP, WAVES } from '../../../constants';
import * as math from '../../../utils/math';
import * as helpers from '../helpers';

const massTransferTxType = NAME_MAP.massTransfer;
const transferTxType = NAME_MAP.transfer;
const asset1Id = 'asset1';
const asset1Name = 'asset1_name';
const asset1Decimals = 2 as AssetDecimals;
const asset1 = {
    assetId: asset1Id,
    decimals: asset1Decimals,
    name: asset1Name,
};
const assets: helpers.MetaAssets = {
    [asset1Id]: asset1,
};
const actualAddress = '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj';
const alias1 = 'alias:T:merry';
const alias1Address = 'alias1_address';
const aliases: helpers.MetaAliases = {
    [alias1]: alias1Address,
};
const massTransferItem1: MassTransferItem<Long> = {
    amount: 1,
    recipient: actualAddress,
};
const massTransferItem2: MassTransferItem<Long> = {
    amount: 2,
    recipient: alias1,
};

describe('getAmountAsset', () => {
    it('returns WAVES if assetId === null', () => {
        expect(helpers.getAmountAsset(null, assets)).toEqual(WAVES);
    });
    it('returns WAVES if assetId === undefined', () => {
        expect(helpers.getAmountAsset(undefined, assets)).toEqual(WAVES);
    });
    it('returns correct asset if non waves asset id passed', () => {
        expect(helpers.getAmountAsset(asset1Id, assets)).toEqual(asset1);
    });
});

describe('getAssetName', () => {
    it('returns WAVES asset name if assetId === null', () => {
        expect(helpers.getAssetName(null, assets)).toBe(WAVES.name);
    });
    it('returns WAVES asset name if assetId === undefined', () => {
        expect(helpers.getAssetName(undefined, assets)).toBe(WAVES.name);
    });
    it('returns correct asset name if non waves asset id passed', () => {
        expect(helpers.getAssetName(asset1Id, assets)).toBe(asset1.name);
    });
});

describe('getFeeAsset', () => {
    it('returns WAVES if mass transfer', () => {
        expect(helpers.getFeeAsset(11, assets)).toEqual(WAVES);
    });
    it('returns WAVES if transaciton fee asset id is undefined', () => {
        expect(helpers.getFeeAsset(4, assets)).toEqual(WAVES);
    });
    it('returns WAVES if transaciton fee asset id === Waves id', () => {
        expect(helpers.getFeeAsset(4, assets, null)).toEqual(WAVES);
    });
    it('returns correct asset if non waves fee asset id passed', () => {
        expect(helpers.getFeeAsset(4, assets, asset1Id)).toEqual(asset1);
    });
});

describe('getRecipientAddress', () => {
    it('returns address for alias', () => {
        expect(helpers.getRecipientAddress(alias1, aliases)).toEqual(
            aliases[alias1]
        );
    });
    it('returns address', () => {
        expect(helpers.getRecipientAddress(actualAddress, aliases)).toEqual(
            actualAddress
        );
    });
});

describe('getRawTransfersList', () => {
    it('returns correct transfers list', () => {
        expect(
            helpers.getRawTransfersList(aliases, [
                massTransferItem1,
                massTransferItem2,
            ])
        ).toMatchInlineSnapshot(`
            Array [
              Object {
                "address": "3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj",
                "amount": 1,
                "name": "3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj",
              },
              Object {
                "address": "alias1_address",
                "amount": 2,
                "name": "alias:T:merry",
              },
            ]
        `);
    });
});

describe('getTotalTransferAmount', () => {
    const rawTransferList = [
        {
            address: '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
            amount: 1,
            name: '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
        },
        {
            address: 'alias1_address',
            amount: 2,
            name: 'alias:T:merry',
        },
    ];

    it('calculates correct total amount #1', () => {
        const decimals = 2;
        const actual = helpers.getTotalTransferAmount(
            rawTransferList,
            decimals
        );

        expect(actual).toBe('0.03');
    });
    it('calculates correct total amount #2', () => {
        const decimals = 4;
        const actual = helpers.getTotalTransferAmount(
            rawTransferList,
            decimals
        );

        expect(actual).toBe('0.0003');
    });
});

describe('getTransferList', () => {
    const rawTransferList = [
        {
            address: '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
            amount: 1,
            name: '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
        },
        {
            address: 'alias1_address',
            amount: 2,
            name: 'alias:T:merry',
        },
    ];
    const decimals = 2;

    let getPrintableNumberMock: any;

    beforeAll(() => {
        getPrintableNumberMock = jest
            .spyOn(math, 'getPrintableNumber')
            .mockImplementation(jest.fn((amount) => String(amount)));
    });

    afterEach(() => {
        getPrintableNumberMock.mockReset();
    });
    afterEach(() => {
        getPrintableNumberMock.mockRestore();
    });

    it('returns correct transfer list', () => {
        const actual = helpers.getTransferList(rawTransferList, decimals);

        expect(getPrintableNumberMock).toHaveBeenCalledTimes(2);
        expect(getPrintableNumberMock).toHaveBeenNthCalledWith(
            1,
            rawTransferList[0].amount,
            decimals
        );
        expect(getPrintableNumberMock).toHaveBeenNthCalledWith(
            2,
            rawTransferList[1].amount,
            decimals
        );
        expect(actual).toMatchSnapshot();
    });
});

describe('getFeeAssetName', () => {
    describe('returns WAVES name if', () => {
        it('mass transfer', () => {
            expect(helpers.getFeeAssetName(11, assets)).toBe(WAVES.name);
        });
        it('transaciton fee asset id is undefined', () => {
            expect(helpers.getFeeAssetName(4, assets)).toEqual(WAVES.name);
        });
        it('fee asset id === Waves id', () => {
            expect(helpers.getFeeAssetName(4, assets, null)).toEqual(
                WAVES.name
            );
        });
    });
    it('returns correct asset if non waves fee asset id passed', () => {
        expect(helpers.getFeeAssetName(4, assets, asset1Id)).toEqual(
            asset1.name
        );
    });
});

describe('getPrintableTxFee', () => {
    it('returns correct value #1', () => {
        const txFee = '100000000';
        const txType = massTransferTxType;
        const actual = helpers.getPrintableTxFee({
            txType,
            txFee,
            assets,
        });

        expect(actual).toBe(`1 ${WAVES.name}`);
    });

    it('returns correct value #2', () => {
        const txFee = '100';
        const txType = transferTxType;
        const txFeeAssetId = asset1Id;

        const actual = helpers.getPrintableTxFee({
            txType,
            txFee,
            assets,
            txFeeAssetId,
        });

        expect(actual).toBe(`1 ${asset1Name}`);
    });
});

describe('getTransferViewData', () => {
    it('returns correct value', () => {
        const txRecipient = alias1;
        const txAssetId = asset1Id;
        const txFee = '100000000';
        const txFeeAssetId = null; //Waves
        const txAmount = '100000000';

        const actual = helpers.getTransferViewData({
            txRecipient,
            txAssetId,
            txFee,
            txFeeAssetId,
            txAmount,
            assets,
            aliases,
        });

        expect(actual).toMatchSnapshot();
    });
});

describe('getMassTransferViewData', () => {
    it('returns correct value', () => {
        const txAssetId = asset1Id;
        const txFee = '100000000';
        const txTransfers = [massTransferItem1, massTransferItem2];

        const actual = helpers.getMassTransferViewData({
            txTransfers,
            txAssetId,
            txFee,
            assets,
            aliases,
        });

        expect(actual).toMatchSnapshot();
    });
});

describe('getViewData', () => {
    beforeAll(() => {
        jest.spyOn(helpers, 'getTransferViewData').mockImplementation(
            () => ({} as any)
        );
        jest.spyOn(helpers, 'getMassTransferViewData').mockImplementation(
            () => ({} as any)
        );
    });
    it("returns no attachement if tx has't one", () => {
        const actual = helpers.getViewData({} as any, {} as any);

        expect(actual.attachment).toBeFalsy();
    });

    it('returns correct attachment', () => {
        const attachment = '72k1xXWG59fYdzSNoA';
        const actual = helpers.getViewData({ attachment } as any, {} as any);

        expect(actual.attachment).toBe('Hello, World!');
    });
});
