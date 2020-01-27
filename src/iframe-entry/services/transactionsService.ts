import { fetchByAlias } from '@waves/node-api-js/es/api-node/alias';
import { fetchDetails } from '@waves/node-api-js/es/api-node/assets';
import { TFeeInfo } from '@waves/node-api-js/es/api-node/transactions';
import getAssetIdListByTx from '@waves/node-api-js/es/tools/adresses/getAssetIdListByTx';
import { IWithId, TTransactionMap } from '@waves/ts-types';
import { TLong, TTransactionParamWithType } from '@waves/signer';
import flatten from 'ramda/es/flatten';
import indexBy from 'ramda/es/indexBy';
import map from 'ramda/es/map';
import pipe from 'ramda/es/pipe';
import prop from 'ramda/es/prop';
import uniq from 'ramda/es/uniq';
import { IUser } from '../../interface';
import { IState } from '../interface';
import { getTxAliases } from '../utils/getTxAliases';
import { getTransactionFromParams } from '../utils/getTransactionFromParams';
import { loadFeeByTransaction } from '../utils/loadFeeByTransaction';
import { loadLogoInfo, DetailsWithLogo } from '../utils/loadLogoInfo';
import { cleanAddress } from '../utils/cleanAlias';

const loadAliases = (
    base: string,
    list: Array<string>
): Promise<Record<string, string>> =>
    Promise.all(
        list.map((alias) =>
            fetchByAlias(base, cleanAddress(alias)).then((item) => ({
                [alias]: item.address,
            }))
        )
    ).then((addressInfo) =>
        addressInfo.reduce(
            (acc, item) => Object.assign(acc, item),
            Object.create(null)
        )
    );

export const prepareTransactions = (
    state: IState<IUser>,
    list: Array<TTransactionParamWithType>
): Promise<Array<ITransactionInfo<TTransactionParamWithType>>> => {
    const transactions = list.map(
        getTransactionFromParams({
            networkByte: state.networkByte,
            privateKey: state.user.privateKey,
        })
    );
    const assetsIdList = getAssetIdListByTx(transactions);
    const transactionsWithFee = Promise.all(
        transactions.map((tx, index) =>
            list[index].fee
                ? Promise.resolve(tx)
                : loadFeeByTransaction(state.nodeUrl, tx)
        )
    );
    const aliases = pipe(map(getTxAliases), flatten, uniq)(transactions);

    return Promise.all([
        transactionsWithFee,
        fetchDetails(state.nodeUrl, assetsIdList).then(
            loadLogoInfo(state.nodeUrl, state.networkByte)
        ),
        loadAliases(state.nodeUrl, aliases),
    ]).then(([transactions, assets, aliases]) =>
        transactions.map((tx, index) => ({
            meta: {
                feeList: [],
                aliases,
                assets: indexBy(prop('assetId'), assets),
                params: list[index],
            },
            tx: { ...tx, fee: list[index].fee ?? tx.fee },
        }))
    );
};

export interface IMeta<T extends TTransactionParamWithType> {
    feeList: Array<TFeeInfo>;
    aliases: Record<string, string>;
    assets: Record<string, DetailsWithLogo>;
    params: T;
}

export interface ITransactionInfo<T extends TTransactionParamWithType> {
    meta: IMeta<T>;
    tx: TTransactionMap<TLong>[T['type']] & IWithId;
}
