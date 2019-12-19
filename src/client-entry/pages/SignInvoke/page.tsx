import React, { FC, useCallback, MouseEventHandler } from 'react';
import { SignInvoke as SignInvokeComponent } from './body';
import { ISignTxProps } from '../../../interface';
import { IInvokeWithType, TLong } from '@waves/waves-js/dist/src/interface';
import { BigNumber } from '@waves/bignumber';
import { WAVES } from '../../../constants';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { ICall, IMoney } from '@waves/waves-js/src/interface';

export interface IPayment {
    assetId: string;
    name: string;
    amount: string;
}

const getAssetName = (
    assets: Record<string, TAssetDetails<TLong>>,
    assetId: string | null
) => {
    return assetId ? assets[assetId].name : 'WAVES';
};

export const SignInvoke: FC<ISignTxProps<IInvokeWithType>> = ({
    meta: txMeta,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const feeAsset = txMeta.assets[tx.feeAssetId || ''] || WAVES;

    const fee = BigNumber.toBigNumber(tx.fee)
        .div(Math.pow(10, feeAsset.decimals))
        .roundTo(feeAsset.decimals)
        .toFixed();

    const handleConfirm = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        onConfirm(tx);
    }, [tx, onConfirm]);

    const mapPayments = (payments: Array<IMoney>): Array<IPayment> =>
        payments.map(({ assetId, amount }) => ({
            assetId,
            name: getAssetName(txMeta.assets, assetId),
            amount: BigNumber.toBigNumber(amount).toFixed(),
        }));

    return (
        <SignInvokeComponent
            userAddress={user.address}
            userName={'userName'}
            userBalance={'userBalance userBalanceAssetName'}
            dApp={tx.dApp}
            fee={`${fee} ${getAssetName(txMeta.assets, tx.feeAssetId)}`}
            call={tx.call as ICall}
            chainId={tx.chainId}
            payment={mapPayments(tx.payment || [])}
            onCancel={onCancel}
            onConfirm={handleConfirm}
        />
    );
};
