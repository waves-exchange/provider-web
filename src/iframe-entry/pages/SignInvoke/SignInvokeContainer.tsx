import React, { FC, useEffect } from 'react';
import { SignInvoke as SignInvokeComponent } from './SignInvokeComponent';
import { ISignTxProps } from '../../../interface';
import { IInvokeWithType, TLong, ICall, IMoney } from '@waves/signer';
import { BigNumber } from '@waves/bignumber';
import { WAVES } from '../../constants';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { DetailsWithLogo } from '../../utils/loadLogoInfo';
import isNil from 'ramda/es/isNil';
import prop from 'ramda/es/prop';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { useTxUser } from '../../hooks/useTxUser';
import { analytics } from '../../utils/analytics';
import { isAlias } from '../../utils/isAlias';
import { getPrintableNumber } from '../../utils/math';

export interface IPayment {
    assetId: string | null;
    name: string;
    amount: TLong;
    logo?: string;
    decimals: number;
}

type GetAssetProp = <P extends keyof DetailsWithLogo>(
    id: string | null,
    property: P
) => DetailsWithLogo[P];

const assetPropFactory = (
    assets: Record<string, TAssetDetails<TLong>>
): GetAssetProp => <P extends keyof DetailsWithLogo>(
    assetId: string | null,
    property: P
): DetailsWithLogo[P] =>
    isNil(assetId)
        ? prop<P, DetailsWithLogo>(property, WAVES)
        : prop<P, DetailsWithLogo>(property, assets[assetId]);

export const SignInvoke: FC<ISignTxProps<IInvokeWithType>> = ({
    meta,
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const { userName, userBalance } = useTxUser(user, networkByte);
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

    return (
        <SignInvokeComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} Waves`}
            dAppAddress={dAppAddress}
            dAppName={tx.dApp}
            fee={`${fee} ${getAssetProp(tx.feeAssetId, 'name')}`}
            call={tx.call as ICall}
            chainId={tx.chainId}
            payment={mapPayments(tx.payment || [])}
            onCancel={handleReject}
            onConfirm={handleConfirm}
        />
    );
};
