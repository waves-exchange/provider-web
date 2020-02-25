import React, { FC, useCallback, useState, ChangeEventHandler } from 'react';
import { ISignTxProps } from '../../../interface';
import { IIssueWithType } from '@waves/signer';
import { useTxUser } from '../../hooks/useTxUser';
import { SignIssueComponent } from './SignIssueComponent';
import { getPrintableNumber } from '../../utils/math';
import { WAVES } from '../../constants';

export const SignIssueContainer: FC<ISignTxProps<IIssueWithType>> = ({
    tx,
    user,
    networkByte,
    onCancel,
    onConfirm,
}) => {
    const { userName, userBalance } = useTxUser(user, networkByte);

    const [canConfirm, setCanConfirm] = useState(false);
    const handleTermsCheck = useCallback<ChangeEventHandler<HTMLInputElement>>(
        ({ target: { checked } }) => {
            setCanConfirm(checked);
        },
        [setCanConfirm]
    );

    return (
        <SignIssueComponent
            assetId={tx.id}
            assetName={tx.name}
            assetDescription={tx.description}
            assetType={tx.reissuable ? 'Reissuable' : 'Non-reissuable'}
            decimals={tx.decimals}
            assetScript={tx.script || ''}
            userAddress={user.address}
            userName={userName}
            userBalance={userBalance}
            issueAmount={`${tx.quantity} ${tx.name}`}
            onConfirm={onConfirm}
            onReject={onCancel}
            onTermsCheck={handleTermsCheck}
            canConfirm={canConfirm}
            tx={tx}
            fee={`${getPrintableNumber(tx.fee, WAVES.decimals)} WAVES`}
        />
    );
};
