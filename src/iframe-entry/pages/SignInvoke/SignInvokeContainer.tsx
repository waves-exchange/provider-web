import { ICall, IInvokeWithType, IMoney, TLong } from '@waves/signer';
import React, { FC, useEffect } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { analytics } from '../../utils/analytics';
import { isAlias } from '../../utils/isAlias';
import { getPrintableNumber } from '../../utils/math';
import { SignInvoke as SignInvokeComponent } from './SignInvokeComponent';
import { assetPropFactory } from '../../utils/assetPropFactory';
import { useHandleFeeSelect } from '../../hooks/useHandleFeeSelect';
import { getUserName } from '../../services/userService';

export interface IPayment {
    assetId: string | null;
    name: string;
    amount: TLong;
    logo?: string;
    decimals: number;
}

export const SignInvoke: FC<ISignTxProps<IInvokeWithType>> = ({
    meta,
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const getAssetProp = assetPropFactory(meta.assets);

    const feeAsset = meta.assets[tx.feeAssetId || ''] || WAVES;

    const fee = getPrintableNumber(tx.fee, feeAsset.decimals);

    const { handleConfirm, handleReject } = useTxHandlers(
        tx,
        onCancel,
        onConfirm,
        {
            onRejectAnalyticsArgs: { name: 'Confirm_Invoke_Tx_Reject' },
            onConfirmAnalyticsArgs: { name: 'Confirm_Invoke_Tx_Confirm' },
        }
    );

    useEffect(
        () =>
            analytics.send({
                name: 'Confirm_Invoke_Tx_Show',
            }),
        []
    );

    const mapPayments = (payments: Array<IMoney>): Array<IPayment> =>
        payments.map(({ assetId, amount }) => ({
            assetId,
            name: getAssetProp(assetId, 'name'),
            amount: getPrintableNumber(
                amount,
                getAssetProp(assetId, 'decimals')
            ),
            logo: getAssetProp(assetId, 'logo'),
            decimals: getAssetProp(assetId, 'decimals'),
        }));

    const dAppAddress = isAlias(tx.dApp) ? meta.aliases[tx.dApp] : tx.dApp;

    const handleFeeSelect = useHandleFeeSelect(tx);

    return (
        <SignInvokeComponent
            key={tx.id}
            userAddress={user.address}
            userName={getUserName(networkByte, user.publicKey)}
            userBalance={user.balance}
            dAppAddress={dAppAddress}
            dAppName={tx.dApp}
            fee={`${fee} ${getAssetProp(tx.feeAssetId, 'name')}`}
            call={tx.call as ICall}
            chainId={tx.chainId}
            payment={mapPayments(tx.payment || [])}
            onCancel={handleReject}
            onConfirm={handleConfirm}
            tx={tx}
            meta={meta}
            handleFeeSelect={handleFeeSelect}
        />
    );
};
