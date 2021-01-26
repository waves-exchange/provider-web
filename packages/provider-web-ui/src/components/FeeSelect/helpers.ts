import { FeeOption } from '@waves.exchange/react-uikit';
import { BigNumber } from '@waves/bignumber';
import { Long } from '@waves/ts-types';
import { DetailsWithLogo } from '../../interface';
import { WAVES } from '../../constants';
import { assetPropFactory } from '../../utils/assetPropFactory';
import { getPrintableNumber } from '../../utils/math';
import { FeeSelectTxMeta } from './FeeSelect';

export const checkIsEnoughBalance = (balance: Long, fee: Long): boolean => {
    return BigNumber.toBigNumber(balance).gte(
        BigNumber.toBigNumber(fee).div(Math.pow(10, WAVES.decimals))
    );
};

const hasParamsFee = (fee: Long | undefined): fee is Long =>
    typeof fee === 'string' || typeof fee === 'number';

const isFeeAssetId = (
    feeAssetId: string | null | undefined
): feeAssetId is string | null => typeof feeAssetId !== 'undefined';

const isNonDefaultFeeAssetId = (
    feeAssetId: string | null | undefined
): feeAssetId is string => typeof feeAssetId === 'string';

export const formatFee = (fee: Long, decimals: number): string =>
    getPrintableNumber(fee, decimals);

type GetFeeOptions = (arg: {
    txFee: Long;
    paramsFee: Long | undefined;
    txMeta: FeeSelectTxMeta;
    paramsFeeAssetId: string | null | undefined;
    availableWavesBalance: Long;
}) => FeeOption[];

export const getFeeOptions: GetFeeOptions = ({
    txFee,
    txMeta,
    paramsFeeAssetId,
    availableWavesBalance,
    paramsFee: txParamsFee,
}) => {
    const getAssetProp = assetPropFactory(txMeta.assets);
    const wavesFeeOption: FeeOption = {
        id: null,
        name: WAVES.name,
        ticker: WAVES.ticker,
        value: formatFee(txFee, WAVES.decimals),
    };

    let defaultFeeOption: FeeOption;
    let feeAsset: DetailsWithLogo;

    if (isFeeAssetId(paramsFeeAssetId) || hasParamsFee(txParamsFee)) {
        if (isNonDefaultFeeAssetId(paramsFeeAssetId)) {
            // case feeAssetId - some asset, but not Waves, fee is not provided
            feeAsset = txMeta.assets[paramsFeeAssetId];
            defaultFeeOption = {
                name: getAssetProp(paramsFeeAssetId, 'name'),
                id: paramsFeeAssetId,
                ticker: '',
                value: formatFee(txFee, feeAsset.decimals),
            };
        } else {
            // case: feeAssetId - Waves or fee provided
            defaultFeeOption = wavesFeeOption;
        }

        // in case feeAssetId provided we can only use it
        return [defaultFeeOption];
    }
    // case: no feeAssetId provided
    // feeAsset = WAVES;
    defaultFeeOption = wavesFeeOption;

    const metaFeeOptions = txMeta.feeList.map((f) => ({
        name: getAssetProp(f.feeAssetId, 'name'),
        id: String(f.feeAssetId),
        ticker: '',
        value: formatFee(f.feeAmount, getAssetProp(f.feeAssetId, 'decimals')),
    }));

    const isEnoughBalance = checkIsEnoughBalance(availableWavesBalance, txFee);
    const hasNonDefaultFees = metaFeeOptions.length > 0;

    let feeOptions;

    if (hasNonDefaultFees) {
        feeOptions = isEnoughBalance
            ? [defaultFeeOption].concat(metaFeeOptions)
            : metaFeeOptions.filter(({ id }) => id !== WAVES.assetId);
    } else {
        feeOptions = [defaultFeeOption];
    }

    return feeOptions;
};
