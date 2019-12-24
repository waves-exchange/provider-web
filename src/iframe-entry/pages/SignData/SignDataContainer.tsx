import BigNumber from '@waves/bignumber';
import { IDataWithType } from '@waves/waves-js';
import React, { FC, MouseEventHandler, useCallback } from 'react';
import { WAVES } from '../../../constants';
import { ISignTxProps } from '../../../interface';
import { SignDataComponent } from './SignDataComponent';
import { getUserName } from '../../services/userService';

export const SignDataContainer: FC<ISignTxProps<IDataWithType>> = ({
    tx,
    user,
    networkByte,
    onConfirm,
    onCancel,
}) => {
    const fee = BigNumber.toBigNumber(tx.fee)
        .div(Math.pow(10, WAVES.decimals))
        .roundTo(WAVES.decimals)
        .toFixed();
    const userName = getUserName(networkByte, user.publicKey);
    const balance = BigNumber.toBigNumber(user.balance)
        .div(Math.pow(10, WAVES.decimals))
        .roundTo(WAVES.decimals)
        .toFixed();

    const userBalance = BigNumber.toBigNumber(user.balance)
        .div(Math.pow(10, WAVES.decimals))
        .toFixed();

    const handleConfirm = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        onConfirm(tx);
    }, [tx, onConfirm]);

    return (
        <SignDataComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} WAVES`}
            data={tx.data}
            fee={`${fee} WAVES`}
            onConfirm={handleConfirm}
            onReject={onCancel}
        />
    );
};
