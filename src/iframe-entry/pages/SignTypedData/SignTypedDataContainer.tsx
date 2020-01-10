import React, { FC, useCallback } from 'react';
import { IUserWithBalances } from '../../../interface';
import { useTxUser } from '../../hooks/useTxUser';
import { ITypedData } from '@waves/signer';
import { SignTypedDataComponent } from './SignTypedDataComponent';

interface ISignTypedDataProps {
    data: Array<ITypedData>;
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
    }, [onConfirm]);
    const handleReject = useCallback(() => {
        onCancel();
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
