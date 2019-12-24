import React, { FC, useCallback, MouseEventHandler } from 'react';
import { SignInvoke as SignInvokeComponent } from './SignInvokeComponent';
import { ISignTxProps } from '../../../interface';
import { IInvokeWithType, TLong } from '@waves/waves-js';
import { BigNumber } from '@waves/bignumber';
import { WAVES } from '../../../constants';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { ICall, IMoney } from '@waves/waves-js';
import { getUserName } from '../../services/userService';
import { DetailsWithLogo } from '../../utils/loadLogoInfo';
import isNil from 'ramda/es/isNil';
import prop from 'ramda/es/prop';

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
    const getAssetProp = assetPropFactory(meta.assets);
    const userBalance = BigNumber.toBigNumber(user.balance)
        .div(Math.pow(10, WAVES.decimals))
        .toFixed();
    const userName = getUserName(networkByte, user.publicKey);

    const feeAsset = meta.assets[tx.feeAssetId || ''] || WAVES;

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
            name: getAssetProp(assetId, 'name'),
            amount: BigNumber.toBigNumber(amount)
                .div(Math.pow(10, getAssetProp(assetId, 'decimals')))
                .toFixed(),
            logo: getAssetProp(assetId, 'logo'),
            decimals: getAssetProp(assetId, 'decimals'),
        }));

    return (
        <SignInvokeComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} Waves`}
            dApp={tx.dApp}
            fee={`${fee} ${getAssetProp(tx.feeAssetId, 'name')}`}
            call={tx.call as ICall}
            chainId={tx.chainId}
            payment={mapPayments(tx.payment || [])}
            onCancel={onCancel}
            onConfirm={handleConfirm}
        />
    );
};
