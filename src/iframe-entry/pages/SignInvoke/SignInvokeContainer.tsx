import { FeeOption } from '@waves.exchange/react-uikit';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { ICall, IInvokeWithType, IMoney, TLong } from '@waves/signer';
import isNil from 'ramda/es/isNil';
import prop from 'ramda/es/prop';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { useTxHandlers } from '../../hooks/useTxHandlers';
import { useTxUser } from '../../hooks/useTxUser';
import { analytics } from '../../utils/analytics';
import { isAlias } from '../../utils/isAlias';
import { DetailsWithLogo } from '../../utils/loadLogoInfo';
import { getCoins, getPrintableNumber } from '../../utils/math';
import { SignInvoke as SignInvokeComponent } from './SignInvokeComponent';

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

    const defaultFee: FeeOption = {
        id: WAVES.assetId,
        name: WAVES.name,
        ticker: WAVES.ticker,
        value: fee,
    };

    const feeList = [defaultFee].concat(
        meta.feeList.map((f) => ({
            name: getAssetProp(f.feeAssetId, 'name'),
            id: String(f.feeAssetId),
            ticker: '',
            value: String(f.feeAmount),
        }))
    );

    const [selectedFee, setSelectedFee] = useState<FeeOption>(defaultFee);

    const handleFeeSelect = useCallback(
        (feeOption: FeeOption) => {
            setSelectedFee(feeOption);
            tx.feeAssetId = feeOption.id;
            tx.fee = getCoins(
                feeOption.value,
                getAssetProp(feeOption.id, 'decimals')
            );
        },
        [getAssetProp, tx.fee, tx.feeAssetId]
    );

    return (
        <SignInvokeComponent
            key={tx.id}
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
            tx={tx}
            meta={meta}
            feeList={feeList}
            selectedFee={selectedFee}
            onFeeSelect={handleFeeSelect}
        />
    );
};
