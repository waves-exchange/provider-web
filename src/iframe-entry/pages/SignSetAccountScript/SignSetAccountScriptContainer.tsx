import React, { FC } from 'react';
import { ISignTxProps } from '../../../interface';
import { WAVES } from '../../constants';
import { getUserName } from '../../services/userService';
import { getPrintableNumber } from '../../utils/math';
import { SignSetAccountScriptComponent } from './SignSetAccountScriptComponent';
import { SetScriptTransaction } from '@waves/ts-types';

export const SignSetAccountScript: FC<ISignTxProps<SetScriptTransaction>> = ({
    networkByte,
    tx,
    user,
    onConfirm,
    onCancel,
}) => {
    const fee = getPrintableNumber(tx.fee, WAVES.decimals);

    return (
        <SignSetAccountScriptComponent
            key={tx.id}
            userAddress={user.address}
            userName={getUserName(networkByte, user.publicKey)}
            userBalance={`${getPrintableNumber(user.balance, WAVES.decimals)} ${
                WAVES.name
            }`}
            userHasScript={user.hasScript}
            tx={tx}
            fee={`${fee} ${WAVES.name}`}
            accountScript={tx.script}
            onCancel={onCancel}
            onConfirm={onConfirm}
        />
    );
};
