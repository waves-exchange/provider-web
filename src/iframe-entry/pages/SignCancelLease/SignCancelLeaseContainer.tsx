import { fetchInfo } from '@waves/node-api-js/es/api-node/transactions';
import { TLong } from '@waves/signer';
import { ICancelLeaseTransactionWithId } from '@waves/ts-types';
import React, { FC, useEffect, useState } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { useTxUser } from '../../hooks/useTxUser';
import { analytics } from '../../utils/analytics';
import { getPrintableNumber } from '../../utils/math';
import { SignCancelLeaseComponent } from './SignCancelLeaseComponent';

export const SignCancelLease: FC<ISignTxProps<
    ICancelLeaseTransactionWithId<TLong>
>> = ({ networkByte, nodeUrl, tx, meta, user, onConfirm, onCancel }) => {
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { userName, userBalance } = useTxUser(user, networkByte);
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    const { handleReject, handleConfirm } = useTxHandlers(
        tx,
        onCancel,
        onConfirm,
        {
            onRejectAnalyticsArgs: { name: 'Confirm_Lease_Tx_Reject' },
            onConfirmAnalyticsArgs: { name: 'Confirm_Lease_Tx_Confirm' },
        }
    );

    useEffect(
        () =>
            analytics.send({
                name: 'Confirm_Lease_Tx_Show',
            }),
        []
    );

    useEffect(() => {
        let isStillActual = true;

        setIsLoading(true);

        fetchInfo(nodeUrl, tx.leaseId)
            .then((res) => {
                if (isStillActual) {
                    setIsLoading(false);
                    setAmount(
                        getPrintableNumber(res['amount'], WAVES.decimals)
                    );
                }
            })
            .catch(() => {
                if (isStillActual) {
                    setIsLoading(false);
                }
            });

        return (): void => {
            isStillActual = false;
        };
    }, [nodeUrl, tx.leaseId]);

    return (
        <SignCancelLeaseComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} ${WAVES.name}`}
            tx={tx}
            meta={meta}
            amount={`${amount} ${WAVES.name}`}
            fee={`${fee} ${WAVES.ticker}`}
            isLoading={isLoading}
            onReject={handleReject}
            onConfirm={handleConfirm}
        />
    );
};
