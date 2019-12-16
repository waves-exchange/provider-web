import {
    TTransactionParamWithType,
    TLong,
} from '@waves/waves-js/dist/src/interface';
import { SPONSORED_TYPES, NAME_MAP } from '../../constants';
import { TTransaction, IWithId } from '@waves/ts-types';
import { getTransactionFromParams } from '../utils/getTransactionFromParams';
import { IUser } from '../../interface';
import curry from 'ramda/es/curry';
import indexBy from 'ramda/es/indexBy';
import prop from 'ramda/es/prop';
import map from 'ramda/es/map';
import pipe from 'ramda/es/pipe';
import flatten from 'ramda/es/flatten';
import {
    TFeeInfo,
    calculateFee,
} from '@waves/blockchain-api/dist/cjs/api-node/transactions';
import getAssetIdListByTx from '@waves/blockchain-api/dist/cjs/tools/adresses/getAssetIdListByTx';
import {
    details,
    TAssetDetails,
} from '@waves/blockchain-api/dist/cjs/api-node/assets';
import { isAddress } from '../utils/isAddress';
import request from '@waves/blockchain-api/dist/cjs/tools/request';
import { IState } from '../interface';
import { alias } from '@waves/waves-transactions';

const canBeSponsored = (tx: TTransaction<TLong> & IWithId): boolean =>
    SPONSORED_TYPES.includes(tx.type);

const getFee = curry(
    (
        state: IState<IUser>,
        tx: TTransaction<TLong> & IWithId
    ): Promise<TTransaction<TLong> & IWithId> =>
        canBeSponsored(tx)
            ? calculateFee(state.nodeUrl, tx)
                  .then((info) => ({ ...tx, fee: info.feeAmount }))
                  .catch(() => ({ ...tx }))
            : Promise.resolve({ ...tx })
);

const getAliasByTx = (tx: TTransaction<TLong> & IWithId): Array<string> => {
    switch (tx.type) {
        case NAME_MAP.transfer:
        case NAME_MAP.lease:
            return isAddress(tx.recipient) ? [] : [tx.recipient];
        case NAME_MAP.massTransfer:
            return tx.transfers.reduce<Array<string>>((acc, transfer) => {
                if (!isAddress(transfer.recipient)) {
                    acc.push(transfer.recipient);
                }

                return acc;
            }, []);
        default:
            return [];
    }
};

const uniqString = (list: Array<string>): Array<string> =>
    Object.keys(
        list.reduce((acc, item) => Object.assign(acc, { [item]: true }), {})
    );

const loadAliases = (
    state: IState<unknown>,
    list: Array<string>
): Promise<Record<string, string>> =>
    Promise.all(
        list.map((alias) =>
            request<{ address: string }>({
                base: state.nodeUrl,
                url: `/alias/by-alias/${alias}`,
            }).then((item) => ({ [alias]: item.address }))
        )
    ).then((list) =>
        list.reduce(
            (acc, item) => Object.assign(acc, item),
            Object.create(null)
        )
    ); // TODO Replace to method from @waves/blockchain-api

export const prepareTransactions = (
    state: IState<IUser>,
    list: Array<TTransactionParamWithType>
): Promise<Array<ITransactionInfo>> => {
    const mekeTx = getTransactionFromParams(state);
    const transactions = list.map(mekeTx);
    const currentFee = getFee(state);
    const assetsIdList = getAssetIdListByTx(transactions);
    const transactionsWithFee = Promise.all(transactions.map(currentFee));
    const aliases = pipe(map(getAliasByTx), flatten, uniqString)(transactions);

    return Promise.all([
        details(state.nodeUrl, assetsIdList),
        transactionsWithFee,
        loadAliases(state, aliases),
    ]).then(([assets, transactions, aliases]) =>
        transactions.map((tx, index) => ({
            meta: {
                feeList: [],
                aliases,
                assets: indexBy(prop('assetId'), assets),
            },
            tx: { ...tx, fee: list[index].fee ?? tx.fee },
            params: list[index],
        }))
    );
};

export interface TMeta {
    feeList: Array<TFeeInfo>;
    aliases: Record<string, string>;
    assets: Record<string, TAssetDetails>;
}

export interface ITransactionInfo {
    meta: TMeta;
    tx: TTransaction<TLong> & IWithId;
    params: TTransactionParamWithType;
}
