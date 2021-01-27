import React, { FC } from 'react';
import { ISignTxProps } from '../../interface';
import { WAVES } from '../../constants';
import { getUserName } from '../../services/userService';
import { getPrintableNumber } from '../../utils/math';
import { SignSponsorshipComponent } from './SignSponsorshipComponent';
import { SponsorshipTransaction } from '@waves/ts-types';

export const SignSponsorship: FC<ISignTxProps<SponsorshipTransaction>> = ({
    meta,
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const sponsorAsset = tx.assetId === null ? WAVES : meta.assets[tx.assetId];
    const sponsorCharge = getPrintableNumber(
        tx.minSponsoredAssetFee,
        sponsorAsset.decimals
    );
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    return (
        <SignSponsorshipComponent
            key={tx.id}
            userAddress={user.address}
            userName={getUserName(networkByte, user.publicKey)}
            userBalance={user.balance}
            tx={tx}
            fee={`${fee} ${WAVES.ticker}`}
            sponsorAsset={sponsorAsset}
            sponsorCharge={`${sponsorCharge} ${sponsorAsset.name}`}
            isSponsorshipEnable={Number(tx.minSponsoredAssetFee) > 0}
            onReject={onCancel}
            onConfirm={onConfirm}
        />
    );
};
