import React, { FC } from 'react';
import { WAVES } from '../../constants';
import { ISignTxProps } from '../../../interface';
import { SignDataComponent } from './SignDataComponent';
import { useTxUser } from '../../hooks/useTxUser';
import { getPrintableNumber } from '../../utils/math';
import { SignerDataTx } from '@waves/signer/src/types/index';
import { TDataTransaction } from '@waves/ts-types';

export const SignDataContainer: FC<ISignTxProps<TDataTransaction>> = ({
    tx,
    user,
    networkByte,
    onConfirm,
    onCancel,
}) => {
    const { userName, userBalance } = useTxUser(user, networkByte);
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    return (
        <SignDataComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} WAVES`}
            tx={tx}
            fee={`${fee} WAVES`}
            onConfirm={onConfirm}
            onReject={onCancel}
        />
    );
};
