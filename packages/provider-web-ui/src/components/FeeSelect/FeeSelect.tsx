import {
    Box,
    BoxProps,
    FeeOption,
    List,
    Select,
    Selected,
    Text,
} from '@waves.exchange/react-uikit';
import {
    InvokeScriptTransaction,
    Long,
    TransferTransaction,
} from '@waves/ts-types';
import React, {
    FC,
    ReactElement,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { IMeta } from '../../interface';
import { assetPropFactory } from '../../utils/assetPropFactory';
import { getCoins } from '../../utils/math';
import { getFeeOptions } from './helpers';

export type FeeSelectHandler = (fee: string, feeAssetId: string | null) => void;

export type FeeSelectTxMeta =
    | IMeta<InvokeScriptTransaction>
    | IMeta<TransferTransaction>;

type Props = {
    txMeta: FeeSelectTxMeta;
    fee: Long;
    onFeeSelect: FeeSelectHandler;
    availableWavesBalance: Long;
};

export const FeeSelect: FC<Props & BoxProps> = ({
    txMeta,
    fee: txFee,
    onFeeSelect,
    availableWavesBalance,
    as: _as, // Types difference in react 16 vs 17 - added slot in ElementType
    ...rest
}) => {
    const txFeeAssetId = txMeta.params.feeAssetId;

    const getAssetProp = assetPropFactory(txMeta.assets);

    const [feeOptions, setFeeOptions] = useState<FeeOption[]>(
        getFeeOptions({
            txFee,
            paramsFee: txMeta.params.fee,
            txMeta,
            paramsFeeAssetId: txFeeAssetId,
            availableWavesBalance,
        })
    );

    useCallback(() => {
        setFeeOptions(
            getFeeOptions({
                txFee,
                paramsFee: txMeta.params.fee,
                txMeta,
                paramsFeeAssetId: txFeeAssetId,
                availableWavesBalance,
            })
        );
    }, [availableWavesBalance, txFee, txFeeAssetId, txMeta]);

    const [selectedFeeOption, setSelectedFeeOption] = useState<FeeOption>(
        feeOptions[0]
    );

    useEffect(() => {
        setSelectedFeeOption(feeOptions[0]);
    }, [feeOptions]);

    useEffect(() => {
        if (selectedFeeOption) {
            const feeAssetId = selectedFeeOption.id;
            const fee = getCoins(
                selectedFeeOption.value,
                getAssetProp(selectedFeeOption.id, 'decimals')
            );

            onFeeSelect(fee, feeAssetId);
        }
    }, [selectedFeeOption]);

    const handleFeeSelect = useCallback(
        (feeOption: FeeOption) => {
            setSelectedFeeOption(feeOption);
        },
        [getAssetProp, onFeeSelect]
    );

    return (
        <Box {...rest}>
            <Text variant="body2" color="basic.$500" display="block" mb="$5">
                Fee
            </Text>
            {feeOptions.length > 1 ? (
                <Select
                    placement="top"
                    renderSelected={(open): ReactElement => (
                        <Selected selected={selectedFeeOption} opened={open} />
                    )}
                >
                    <List onSelect={handleFeeSelect} options={feeOptions} />
                </Select>
            ) : (
                <Text variant="body2" color="standard.$0">
                    {selectedFeeOption.value} {selectedFeeOption.name}
                </Text>
            )}
        </Box>
    );
};
