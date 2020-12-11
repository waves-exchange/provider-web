import { useCallback, useState, useEffect } from 'react';
import { FeeSelectHandler } from '../components/FeeSelect/FeeSelect';
import {
    IWithId,
    TInvokeScriptTransaction,
    TSignedTransaction,
} from '@waves/ts-types';
import { TransferType } from '../pages/SignTransfer/SignTransferContainer';

type Tx = (TransferType | TInvokeScriptTransaction) & IWithId;

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
