import { useCallback, useEffect, useState } from 'react';
import { FeeSelectHandler } from '../components/FeeSelect/FeeSelect';
import { InvokeScriptTransaction, WithId } from '@waves/ts-types';
import { TransferType } from '../pages/SignTransfer/SignTransferContainer';

type Tx = (TransferType | InvokeScriptTransaction) & WithId;

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
