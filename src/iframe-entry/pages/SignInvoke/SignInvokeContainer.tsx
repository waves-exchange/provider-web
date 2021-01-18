import React, { FC } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { isAlias } from '../../utils/isAlias';
import { SignInvoke as SignInvokeComponent } from './SignInvokeComponent';
import { assetPropFactory } from '../../utils/assetPropFactory';
import { useHandleFeeSelect } from '../../hooks/useHandleFeeSelect';
import { getUserName } from '../../services/userService';
import { getPrintableNumber } from '../../utils/math';
import {
    InvokeScriptCall,
    InvokeScriptPayment,
    InvokeScriptTransaction,
    Long,
} from '@waves/ts-types';

export interface IPayment {
    assetId: string | null;
    name: string;
    amount: Long;
    logo?: string;
    decimals: number;
}

export const SignInvoke: FC<ISignTxProps<InvokeScriptTransaction>> = ({
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

    const mapPayments = (
        payments: Array<InvokeScriptPayment>
    ): Array<IPayment> =>
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

    const [handleFeeSelect, txJSON] = useHandleFeeSelect(tx);

    return (
        <SignInvokeComponent
            userAddress={user.address}
            userName={getUserName(networkByte, user.publicKey)}
            userBalance={user.balance}
            dAppAddress={dAppAddress}
            dAppName={tx.dApp}
            fee={`${fee} ${getAssetProp(tx.feeAssetId, 'name')}`}
            call={tx.call as InvokeScriptCall<Long>}
            chainId={tx.chainId}
            payment={mapPayments(tx.payment || [])}
            onCancel={onCancel}
            onConfirm={onConfirm}
            tx={tx}
            txJSON={txJSON}
            meta={meta}
            handleFeeSelect={handleFeeSelect}
        />
    );
};
