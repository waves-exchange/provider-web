import { MouseEventHandler, useCallback } from 'react';
import { analytics, IEventData } from '../utils/analytics';
import { TTransaction, TTransactionWithId } from '@waves/ts-types';
import { TLong } from '@waves/signer';

type AnalyticsArgs = {
    onRejectAnalyticsArgs: IEventData;
    onConfirmAnalyticsArgs: IEventData;
};

type TxHandlers = {
    handleReject: MouseEventHandler<HTMLButtonElement>;
    handleConfirm: MouseEventHandler<HTMLButtonElement>;
};

type UseTxHandlers = (
    tx: TTransactionWithId<TLong>,
    onReject: () => void,
    onConfirm: (tx: TTransaction<TLong>) => void,
    analyticsArgs: AnalyticsArgs
) => TxHandlers;

export const useTxHandlers: UseTxHandlers = (
    tx,
    onReject,
    onConfirm,
    { onRejectAnalyticsArgs, onConfirmAnalyticsArgs }
) => {
    const handleReject = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        onReject();

        analytics.send(onRejectAnalyticsArgs);
    }, [onReject, onRejectAnalyticsArgs]);

    const handleConfirm = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        onConfirm(tx);

        analytics.send(onConfirmAnalyticsArgs);
    }, [onConfirm, onConfirmAnalyticsArgs, tx]);

    return { handleConfirm, handleReject };
};
