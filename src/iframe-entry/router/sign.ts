import { IWithId, TTransactionWithProofs } from '@waves/ts-types';
import {
    TLong,
    TRANSACTION_TYPE_MAP,
    TTransactionParamWithType,
} from '@waves/signer';
import { libs, signTx } from '@waves/waves-transactions';
import React, { ReactNode } from 'react';
import { NAME_MAP } from '../constants';
import { ISignTxProps, IUserWithBalances } from '../../interface';
import { IState } from '../interface';
// import exchangePage from '../pages/transactions/exchange';
// import leasePage from '../pages/transactions/lease';
// import cancelLeasePage from '../pages/transactions/cancelLease';
// import aliasPage from '../pages/transactions/alias';
// import massTransferPage from '../pages/transactions/massTransfer';
// import setScriptPage from '../pages/transactions/setScript';
// import sponsorshipPage from '../pages/transactions/sponsorship';
// import setAssetScriptPage from '../pages/transactions/setAssetScript';
import { prepareTransactions } from '../services/transactionsService';
import renderPage from '../utils/renderPage';
import batch from './batch';
import omit from 'ramda/es/omit';
import { SignTransfer } from '../pages/SignTransfer/SignTransferContainer';
import { SignInvoke } from '../pages/SignInvoke/SignInvokeContainer';
import { SignDataContainer } from '../pages/SignData/SignDataContainer';
import { SignCancelLease } from '../pages/SignCancelLease/SignCancelLeaseContainer';
import { SignIssueContainer } from '../pages/SignIssue/SignIssueContainer';

const getPageByType = (type: keyof TRANSACTION_TYPE_MAP): ReactNode => {
    switch (type) {
        case NAME_MAP.transfer:
            return SignTransfer;
        case NAME_MAP.invoke:
            return SignInvoke;
        case NAME_MAP.data:
            return SignDataContainer;
        case NAME_MAP.issue:
            return SignIssueContainer;
        case NAME_MAP.exchange:
            throw new Error('Unsupported type!'); // TODO
        case NAME_MAP.lease:
            throw new Error('Unsupported type!'); // TODO
        case NAME_MAP.cancelLease:
            return SignCancelLease;
        case NAME_MAP.alias:
            throw new Error('Unsupported type!'); // TODO
        case NAME_MAP.massTransfer:
            throw new Error('Unsupported type!'); // TODO
        case NAME_MAP.setScript:
            throw new Error('Unsupported type!'); // TODO
        case NAME_MAP.sponsorship:
            throw new Error('Unsupported type!'); // TODO
        case NAME_MAP.setAssetScript:
            throw new Error('Unsupported type!'); // TODO
        default:
            throw new Error('Unsupported transaction!');
    }
};

export default function(
    list: Array<TTransactionParamWithType>,
    state: IState<IUserWithBalances>
): Promise<Array<TTransactionWithProofs<TLong> & IWithId>> {
    return prepareTransactions(state, list).then((transactions) => {
        if (transactions.length !== 1) {
            return batch(transactions, state);
        }

        const [info] = transactions;

        return new Promise((resolve, reject) => {
            const props = {
                ...info,
                networkByte: state.networkByte,
                user: {
                    ...omit(['privateKey'], state.user),
                    publicKey: libs.crypto.publicKey({
                        privateKey: state.user.privateKey,
                    }),
                },
                onConfirm: (transaction) => {
                    resolve(
                        signTx(transaction as any, {
                            privateKey: state.user.privateKey,
                        }) as any
                    );
                },
                onCancel: () => {
                    reject(new Error('User rejection!'));
                },
            } as ISignTxProps<TTransactionParamWithType>;

            renderPage(
                React.createElement(getPageByType(info.tx.type) as any, {
                    key: info.tx.id,
                    ...props,
                })
            );
        });
    });
}
