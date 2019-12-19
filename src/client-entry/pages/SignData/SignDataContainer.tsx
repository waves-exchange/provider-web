import BigNumber from '@waves/bignumber';
import { IDataWithType } from '@waves/waves-js/dist/src/interface';
import React, { FC, MouseEventHandler, useCallback } from 'react';
import { WAVES } from '../../../constants';
import { ISignTxProps } from '../../../interface';
import { SignDataComponent } from './SignDataComponent';

export const SignDataContainer: FC<ISignTxProps<IDataWithType>> = ({
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const fee = BigNumber.toBigNumber(tx.fee)
        .div(Math.pow(10, WAVES.decimals))
        .roundTo(WAVES.decimals)
        .toFixed();

    const handleConfirm = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        onConfirm(tx);
    }, [tx, onConfirm]);

    return (
        <SignDataComponent
            userAddress={user.address}
            userName={'userName'}
            userBalance={'userBalance userBalanceAssetName'}
            data={tx.data}
            fee={`${fee} WAVES`}
            onConfirm={handleConfirm}
            onReject={onCancel}
        />
    );
};
