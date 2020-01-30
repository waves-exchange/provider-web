import { useCallback } from 'react';
import { FeeSelectHandler } from '../components/FeeSelect/FeeSelect';
import {
    ITransferTransactionWithId,
    IInvokeScriptTransactionWithId,
} from '@waves/ts-types';
import { TLong } from '@waves/signer';

type Tx =
    | ITransferTransactionWithId<TLong>
    | IInvokeScriptTransactionWithId<TLong>;

export const useHandleFeeSelect = (tx: Tx): FeeSelectHandler =>
    useCallback<FeeSelectHandler>(
        (fee, feeAssetId) => {
            tx.fee = fee;
            tx.feeAssetId = feeAssetId;
        },
        [tx.fee, tx.feeAssetId]
    );
