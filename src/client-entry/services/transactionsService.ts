import {
    TTransactionParamWithType,
    TLong,
} from '@waves/waves-js/dist/src/interface';
import { loadFeeByTransaction } from '../utils/loadFeeByTransaction';
import { getAliasByTx } from '../utils/getAliasByTx';
import { TTransaction, IWithId } from '@waves/ts-types';
import { getTransactionFromParams } from '../utils/getTransactionFromParams';
import { IUser } from '../../interface';
import indexBy from 'ramda/es/indexBy';
import prop from 'ramda/es/prop';
import map from 'ramda/es/map';
import pipe from 'ramda/es/pipe';
import flatten from 'ramda/es/flatten';
import uniq from 'ramda/es/uniq';
import { TFeeInfo } from '@waves/blockchain-api/dist/cjs/api-node/transactions';
import getAssetIdListByTx from '@waves/blockchain-api/dist/cjs/tools/adresses/getAssetIdListByTx';
import {
    details,
    TAssetDetails,
} from '@waves/blockchain-api/dist/cjs/api-node/assets';
import request from '@waves/blockchain-api/dist/cjs/tools/request';
import { IState } from '../interface';

const loadAliases = (
    base: string,
    list: Array<string>
): Promise<Record<string, string>> =>
    Promise.all(
        list.map((alias) =>
            request<{ address: string }>({
                base,
                url: `/alias/by-alias/${alias}`,
            }).then((item) => ({ [alias]: item.address }))
        )
    ).then((addressInfo) =>
        addressInfo.reduce(
            (acc, item) => Object.assign(acc, item),
            Object.create(null)
        )
    ); // TODO Replace to method from @waves/blockchain-api

export const prepareTransactions = (
    state: IState<IUser>,
    list: Array<TTransactionParamWithType>
): Promise<Array<ITransactionInfo>> => {
    const transactions = list.map(
        getTransactionFromParams({
            networkByte: state.networkByte,
            seed: state.user.seed,
        })
    );
    const assetsIdList = getAssetIdListByTx(transactions);
    const transactionsWithFee = Promise.all(
        transactions.map(loadFeeByTransaction(state.nodeUrl))
    );
    const aliases = pipe(map(getAliasByTx), flatten, uniq)(transactions);

    return Promise.all([
        transactionsWithFee,
        details(state.nodeUrl, assetsIdList),
        loadAliases(state.nodeUrl, aliases),
    ]).then(([transactions, assets, aliases]) =>
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
