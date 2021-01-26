import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import { WAVES } from '../../constants';
import { useTxUser } from '../../hooks/useTxUser';
import { cleanAddress } from '../../utils/cleanAlias';
import { isAlias } from '../../utils/isAlias';
import { getPrintableNumber } from '../../utils/math';
import { SignLeaseComponent } from './SignLeaseComponent';
import { LeaseTransaction } from '@waves/ts-types';

export const SignLease: FC<ISignTxProps<LeaseTransaction>> = ({
    networkByte,
    tx,
    meta,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userName, userBalance } = useTxUser(user, networkByte);
    const amount = getPrintableNumber(tx.amount, WAVES.decimals);
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    const recipientAddress = isAlias(tx.recipient)
        ? meta.aliases[tx.recipient]
        : tx.recipient;

    return (
        <SignLeaseComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} ${WAVES.name}`}
            recipientAddress={recipientAddress}
            recipientName={cleanAddress(tx.recipient)}
            tx={tx}
            amount={`${amount} ${WAVES.name}`}
            fee={`${fee} ${WAVES.name}`}
            onReject={onCancel}
            onConfirm={onConfirm}
        />
    );
};
