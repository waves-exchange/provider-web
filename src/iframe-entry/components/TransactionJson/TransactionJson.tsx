import { TTransactionWithId } from '@waves/ts-types';
import React, { FC } from 'react';
import { DataJson } from '../DataJson/DataJson';

type TransactionJsonProps = {
    tx: TTransactionWithId<unknown>;
};

export const TransactionJson: FC<TransactionJsonProps> = ({ tx }) => (
    <DataJson data={tx} />
);
