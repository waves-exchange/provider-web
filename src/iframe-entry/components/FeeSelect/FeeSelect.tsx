import {
    Box,
    BoxProps,
    FeeOption,
    List,
    Select,
    Selected,
    Text,
} from '@waves.exchange/react-uikit';
import { TLong, ITransferWithType, IInvokeWithType } from '@waves/signer';
import React, {
    FC,
    ReactElement,
    useCallback,
    useState,
    useEffect,
} from 'react';
import { IMeta } from '../../services/transactionsService';
import { assetPropFactory } from '../../utils/assetPropFactory';
import { getCoins } from '../../utils/math';
import { getFeeOptions } from './helpers';

export type FeeSelectHandler = (fee: string, feeAssetId: string | null) => void;

export type FeeSelectTxMeta = IMeta<IInvokeWithType> | IMeta<ITransferWithType>;

type Props = {
    txMeta: FeeSelectTxMeta;
    fee: TLong;
    onFeeSelect: FeeSelectHandler;
    availableWavesBalance: TLong;
};

export const FeeSelect: FC<Props & BoxProps> = ({
    txMeta,
    fee: txFee,
    onFeeSelect,
    availableWavesBalance,
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

    const handleFeeSelect = useCallback(
        (feeOption: FeeOption) => {
            setSelectedFeeOption(feeOption);

            const feeAssetId = feeOption.id;
            const fee = getCoins(
                feeOption.value,
                getAssetProp(feeOption.id, 'decimals')
            );

            onFeeSelect(fee, feeAssetId);
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
