import { useCallback, useState, useEffect } from 'react';
import { FeeSelectHandler } from '../components/FeeSelect/FeeSelect';
import {
    ITransferTransactionWithId,
    IInvokeScriptTransactionWithId,
    IMassTransferTransactionWithId,
} from '@waves/ts-types';
import { TLong } from '@waves/signer';

type Tx =
    | ITransferTransactionWithId<TLong>
    | IInvokeScriptTransactionWithId<TLong>
    | IMassTransferTransactionWithId<TLong>;

export const useHandleFeeSelect = (tx: Tx): [FeeSelectHandler, string] => {
    const [txJSON, setTxJSON] = useState(JSON.stringify(tx, null, 2));

    useEffect(() => setTxJSON(JSON.stringify(tx, null, 2)), [tx, tx.id]);

    return [
        useCallback<FeeSelectHandler>(
            (fee, feeAssetId) => {
                tx.fee = fee;
                tx['feeAssetId'] = feeAssetId;
                setTxJSON(JSON.stringify(tx, null, 2));
            },
            [tx]
        ),
        txJSON,
    ];
};
