import { MouseEventHandler, useCallback, useMemo } from 'react';
import { analytics } from '../utils/analytics';
import { TTransaction, TTransactionWithId } from '@waves/ts-types';
import { TLong } from '@waves/signer';
import { NAME_MAP } from '@waves/node-api-js/es/constants';

type TxHandlers = {
    handleReject: MouseEventHandler<HTMLButtonElement>;
    handleConfirm: MouseEventHandler<HTMLButtonElement>;
    handleShow: () => void;
};

type UseTxHandlers = (
    tx: TTransactionWithId<TLong>,
    onReject: () => void,
    onConfirm: (tx: TTransaction<TLong>) => void
) => TxHandlers;

export const useTxHandlers: UseTxHandlers = (tx, onReject, onConfirm) => {
    const analyticsParams = useMemo(
        () => ({
            type: Object.keys(NAME_MAP).find(
                (txType) => NAME_MAP[txType] === tx.type
            ),
        }),
        [tx.type]
    );

    const handleShow = useMemo(
        () => (): void =>
            analytics.send({
                name: 'Signer_Confirm_Tx_Show',
                params: analyticsParams,
            }),
        [analyticsParams]
    );

    const handleReject = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        onReject();

        analytics.send({
            name: 'Signer_Confirm_Tx_Reject',
            params: analyticsParams,
        });
    }, [analyticsParams, onReject]);

    const handleConfirm = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        onConfirm(tx);

        analytics.send({
            name: 'Signer_Confirm_Tx_Approve',
            params: analyticsParams,
        });
    }, [analyticsParams, onConfirm, tx]);

    return { handleConfirm, handleReject, handleShow };
};
