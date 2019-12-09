import { IState } from '../index';
import renderPage from '../utils/renderPage';
import { TLong, TRANSACTION_TYPE_MAP, TTransactionParamWithType } from '@waves/waves-js/dist/src/interface';
import issuePage from '../pages/transactions/issue';
import transferPage from '../pages/transactions/transfer';
import reissuePage from '../pages/transactions/reissue';
import burnPage from '../pages/transactions/burn';
// import exchangePage from '../pages/transactions/exchange';
// import leasePage from '../pages/transactions/lease';
// import cancelLeasePage from '../pages/transactions/cancelLease';
// import aliasPage from '../pages/transactions/alias';
// import massTransferPage from '../pages/transactions/massTransfer';
import dataPage from '../pages/transactions/data';
// import setScriptPage from '../pages/transactions/setScript';
// import sponsorshipPage from '../pages/transactions/sponsorship';
// import setAssetScriptPage from '../pages/transactions/setAssetScript';
import invokePage from '../pages/transactions/invoke';
import { IWithId, TTransactionWithProofs } from '@waves/ts-types';
import { NAME_MAP } from '../../constants';
import batch from './batch';
import { prepareTransactions } from '../utils';
import { libs, signTx } from '@waves/waves-transactions';
import { ISignTxProps, IUser } from '../../interface';
import loader from '../components/loader';
const React = require('react');


const getPageByType = (type: keyof TRANSACTION_TYPE_MAP) => {
    switch (type) {
        case NAME_MAP.issue:
            return issuePage;
        case NAME_MAP.transfer:
            return transferPage;
        case NAME_MAP.reissue:
            return reissuePage;
        case NAME_MAP.burn:
            return burnPage;
        case NAME_MAP.exchange:
        // return exchangePage; TODO
        case NAME_MAP.lease:
        // return leasePage; TODO
        case NAME_MAP.cancelLease:
        // return cancelLeasePage; TODO
        case NAME_MAP.alias:
        // return aliasPage; TODO
        case NAME_MAP.massTransfer:
        // return massTransferPage; TODO
        case NAME_MAP.data:
            return dataPage;
        case NAME_MAP.setScript:
        // return setScriptPage; TODO
        case NAME_MAP.sponsorship:
        // return sponsorshipPage; TODO
        case NAME_MAP.setAssetScript:
        // return setAssetScriptPage; TODO
        case NAME_MAP.invoke:
            return invokePage;
        default:
            throw new Error('Unsupported transaction!');
    }
};

export default function (list: Array<TTransactionParamWithType>, state: IState<IUser>): Promise<Array<TTransactionWithProofs<TLong> & IWithId>> {
    renderPage(React.createElement(loader, {}));

    console.log('Trololo');

    return prepareTransactions(state, list).then(transactions => {

        if (transactions.length !== 1) {
            return batch(transactions, state);
        }

        const [tx] = transactions;
        return new Promise((resolve, reject) => {
            renderPage(React.createElement(getPageByType(tx.origin.type) as any, {
                networkByte: state.networkByte,
                assets: tx.assets,
                user: {
                    address: state.user.address,
                    publicKey: libs.crypto.publicKey(state.user.seed)
                },
                tx: tx,
                availableFee: tx.feeList,
                onConfirm: (transaction) => {
                    resolve(signTx(transaction as any, state.user.seed) as any);
                },
                onCancel: () => {
                    reject(new Error('User rejection!'));
                }
            } as ISignTxProps<any>));
        });
    });
}