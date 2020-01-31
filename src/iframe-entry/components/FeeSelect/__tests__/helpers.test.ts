import * as helpers from '../helpers';
import { WAVES } from '../../../constants';
import { TTransactionParamWithType } from '@waves/signer';
import { IMeta } from '../../../services/transactionsService';
import { RecursivePartial } from '../../../../interface';

type PartialMeta = RecursivePartial<IMeta<TTransactionParamWithType>>;

const wavesFeeAssetId = null;
const notWavesFeeAssetId = 'not_waves_fee_asset_id';
const notWavesAssetName = 'not a waves asset';

describe('getFeeOptions', () => {
    const getFeeMock = jest.spyOn(helpers, 'formatFee');

    describe('fee provided', () => {
        it('should return waves fee option only', () => {
            const txFee = '1000';

            getFeeMock.mockReturnValue(txFee);

            const actual = helpers.getFeeOptions({
                txFee,
                paramsFee: txFee,
                txMeta: { assets: [] } as any,
                paramsFeeAssetId: undefined as any, // not relevant for test
                availableWavesBalance: undefined as any, // not relevant for test
            });

            const expected = [
                {
                    id: wavesFeeAssetId,
                    name: WAVES.name,
                    value: txFee,
                    ticker: WAVES.ticker,
                },
            ];

            expect(actual).toEqual(expected);
            getFeeMock.mockReset();
        });
    });

    describe('feeAssetId provided', () => {
        const txFee = '1000';
        const availableWavesBalance = '1000';
        const txMeta: PartialMeta = {
            assets: {
                [notWavesFeeAssetId]: {
                    name: notWavesAssetName,
                },
            },
        };

        beforeAll(() => {
            getFeeMock.mockReturnValue(txFee);
        });
        afterAll(() => {
            getFeeMock.mockReset();
        });

        describe('feeAssetId !== Waves, fee === undefinded', () => {
            it('should return asset fee option', () => {
                const paramsFeeAssetId = notWavesFeeAssetId;

                const actual = helpers.getFeeOptions({
                    txFee: undefined as any,
                    txMeta: txMeta as any,
                    paramsFeeAssetId,
                    availableWavesBalance: availableWavesBalance,
                    paramsFee: undefined,
                });

                const expected = [
                    {
                        id: notWavesFeeAssetId,
                        name: notWavesAssetName,
                        value: txFee,
                        ticker: '',
                    },
                ];

                expect(actual).toEqual(expected);
            });
        });

        describe('feeAssetId === Waves', () => {
            it('should return waves fee option, fee === undefinded', () => {
                const paramsFeeAssetId = wavesFeeAssetId;

                const actual = helpers.getFeeOptions({
                    txFee: undefined as any,
                    txMeta: txMeta as any,
                    paramsFeeAssetId,
                    availableWavesBalance: availableWavesBalance,
                    paramsFee: undefined,
                });

                const expected = [
                    {
                        id: null,
                        name: WAVES.name,
                        value: txFee,
                        ticker: WAVES.ticker,
                    },
                ];

                expect(actual).toEqual(expected);
            });
        });
    });

    describe('feeAssetId is not provided', () => {
        let checkIsEnoughBalanceMock: jest.SpyInstance;

        beforeAll(() => {
            getFeeMock.mockImplementation((fee) => String(fee));
            checkIsEnoughBalanceMock = jest.spyOn(
                helpers,
                'checkIsEnoughBalance'
            );
        });
        afterAll(() => {
            getFeeMock.mockReset();
            checkIsEnoughBalanceMock.mockReset();
        });

        describe('meta fee list is not empty', () => {
            const metaWavesFeeAmount = '1000';
            const metaWavesFeeAssetId = WAVES.assetId;
            const metaWavesFeeAssetName = WAVES.name;

            const metaFeeAmount = '1000';
            const metaFeeAssetId = notWavesFeeAssetId;
            const metaFeeAssetName = notWavesAssetName;

            const metaFeeWaves = {
                feeAmount: metaWavesFeeAmount,
                feeAssetId: metaWavesFeeAssetId,
            };
            const metaFeeNotWaves = {
                feeAmount: metaFeeAmount,
                feeAssetId: metaFeeAssetId,
            };

            const txMeta: PartialMeta = {
                feeList: [metaFeeNotWaves, metaFeeWaves],
                assets: {
                    [metaWavesFeeAssetId]: {
                        name: metaWavesFeeAssetName,
                        quantity: metaWavesFeeAmount,
                    },
                    [metaFeeAssetId]: {
                        name: metaFeeAssetName,
                    },
                },
            };

            describe('not enough waves balance', () => {
                it("doesn't include waves fee option", () => {
                    checkIsEnoughBalanceMock.mockReturnValueOnce(false);

                    const actual = helpers.getFeeOptions({
                        txFee: undefined as any,
                        txMeta: txMeta as any, // not relevant for test
                        paramsFeeAssetId: undefined as any, // not relevant for test
                        availableWavesBalance: undefined as any, // not relevant for test
                        paramsFee: undefined,
                    });

                    const expected = [
                        {
                            id: metaFeeAssetId,
                            name: metaFeeAssetName,
                            value: String(metaFeeAmount),
                            ticker: '',
                        },
                    ];

                    expect(actual).toEqual(expected);
                });
            });
            describe('enough waves balance', () => {
                it('includes waves fee option', () => {
                    checkIsEnoughBalanceMock.mockReturnValueOnce(true);

                    const actual = helpers.getFeeOptions({
                        txFee: undefined as any,
                        txMeta: txMeta as any, // not relevant for test
                        paramsFeeAssetId: undefined as any, // not relevant for test
                        availableWavesBalance: undefined as any, // not relevant for test
                        paramsFee: undefined,
                    });

                    expect(actual).toContainEqual({
                        id: metaFeeAssetId,
                        name: metaFeeAssetName,
                        value: String(metaFeeAmount),
                        ticker: '',
                    });
                    expect(actual).toContainEqual({
                        id: metaWavesFeeAssetId,
                        name: metaWavesFeeAssetName,
                        value: String(metaWavesFeeAmount),
                        ticker: '',
                    });
                });
            });
        });
        describe('meta fee list is empty', () => {
            const txFee = '2000';
            const txMeta: PartialMeta = {
                feeList: [],
            };

            describe('enough waves balance', () => {
                it('should return only waves fee option', () => {
                    checkIsEnoughBalanceMock.mockReturnValueOnce(true);

                    const actual = helpers.getFeeOptions({
                        txFee,
                        txMeta: txMeta as any, // not relevant for test
                        paramsFeeAssetId: undefined as any, // not relevant for test
                        availableWavesBalance: undefined as any, // not relevant for test
                        paramsFee: undefined,
                    });

                    const expected = [
                        {
                            id: null,
                            name: WAVES.name,
                            ticker: WAVES.ticker,
                            value: txFee,
                        },
                    ];

                    expect(actual).toEqual(expected);
                });
            });
            describe('not enough waves balance', () => {
                it('should return only waves fee option', () => {
                    checkIsEnoughBalanceMock.mockReturnValueOnce(false);

                    const actual = helpers.getFeeOptions({
                        txFee,
                        txMeta: txMeta as any, // not relevant for test
                        paramsFeeAssetId: undefined as any, // not relevant for test
                        availableWavesBalance: undefined as any, // not relevant for test
                        paramsFee: undefined,
                    });

                    const expected = [
                        {
                            id: null,
                            name: WAVES.name,
                            ticker: WAVES.ticker,
                            value: txFee,
                        },
                    ];

                    expect(actual).toEqual(expected);
                });
            });
        });
    });
});
