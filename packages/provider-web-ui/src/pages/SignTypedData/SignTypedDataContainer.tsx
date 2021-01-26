import React, { FC, useCallback } from 'react';
import { IUserWithBalances } from '../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import { TypedData } from '@waves/signer';
import { SignTypedDataComponent } from './SignTypedDataComponent';
import { analytics } from '../../utils/analytics';

interface ISignTypedDataProps {
    data: Array<TypedData>;
    user: IUserWithBalances & { publicKey: string };
    networkByte: number;
    onConfirm: () => void;
    onCancel: () => void;
}

export const SignTypedDataContainer: FC<ISignTypedDataProps> = ({
    data,
    user,
    networkByte,
    onConfirm,
    onCancel,
}) => {
    const { userName, userBalance } = useTxUser(user, networkByte);
    const handleConfirm = useCallback(() => {
        onConfirm();
        analytics.send({ name: 'Confirm_Sign_Typed_Data_Confirm' });
    }, [onConfirm]);
    const handleReject = useCallback(() => {
        onCancel();
        analytics.send({ name: 'Confirm_Sign_Typed_Data_Reject' });
    }, [onCancel]);

    return (
        <SignTypedDataComponent
            userAddress={user.address}
            userName={userName}
            userBalance={`${userBalance} Waves`}
            data={data}
            onConfirm={handleConfirm}
            onReject={handleReject}
        />
    );
};
