import { fetchByAlias } from '@waves/node-api-js/es/api-node/alias';
import { fetchDetails } from '@waves/node-api-js/es/api-node/assets';
import {
    fetchInfo,
    TFeeInfo,
} from '@waves/node-api-js/es/api-node/transactions';
import { NAME_MAP } from '@waves/node-api-js/es/constants';
import availableSponsoredBalances from '@waves/node-api-js/es/tools/adresses/availableSponsoredBalances';
import getAssetIdListByTx from '@waves/node-api-js/es/tools/adresses/getAssetIdListByTx';
import { SignerTx } from '@waves/signer';
import { Long, Transaction, TransactionType } from '@waves/ts-types';
import { concat, flatten, indexBy, map, pipe, prop, uniq } from 'ramda';
import { InfoMap, ITransactionInfo, IUser } from '../interface';
import { SPONSORED_TYPES, WAVES } from '../constants';
import { IState } from '../interface';
import { cleanAddress } from '../utils/cleanAlias';
import { geTransactionFromParams } from '../utils/getTransactionFromParams';
import { getTxAliases } from '../utils/getTxAliases';
import { loadFeeByTransaction } from '../utils/loadFeeByTransaction';
import { loadLogoInfo } from '../utils/loadLogoInfo';

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
    txs: Array<SignerTx>,
    timestamp: number
): Promise<Array<ITransactionInfo<Transaction>>> => {
    const list = Array.isArray(txs) ? txs : [txs];
    const transactions: Array<Transaction> = list.map(
        geTransactionFromParams({
            networkByte: state.networkByte,
            privateKey: state.user.privateKey,
            timestamp,
        })
    ) as any;
    const assetsIdList = getAssetIdListByTx(transactions);
    const transactionsWithFee = Promise.all<Transaction>(
        transactions.map((tx, index) =>
            list[index].fee
                ? Promise.resolve(tx)
                : loadFeeByTransaction(state.nodeUrl, tx as any)
        ) as any
    );
    const aliases = pipe(map(getTxAliases), flatten, uniq)(transactions);
    const fetchFeeList = transactionsWithFee.then((txs) =>
        Promise.all(
            txs.map((tx, index) =>
                SPONSORED_TYPES.includes(tx.type) &&
                list[index].fee == null &&
                list[index]['feeAssetId'] == null
                    ? availableSponsoredBalances(
                          state.nodeUrl,
                          state.user.address,
                          tx.fee as Long
                      ).then((l) =>
                          l.map((x) => ({
                              feeAssetId: x.assetId,
                              feeAmount: x.assetFee,
                          }))
                      )
                    : Promise.resolve([])
            )
        )
    );

    const loadAssets = fetchFeeList.then((list) =>
        fetchDetails(
            state.nodeUrl,
            pipe<
                TFeeInfo[][],
                TFeeInfo[],
                (string | null)[],
                string[],
                string[],
                string[]
            >(
                flatten,
                map(prop('feeAssetId')),
                (list) => list.filter((id): id is string => id != null),
                concat(assetsIdList),
                uniq
            )(list)
        )
    );

    const loadInfo = <T extends TransactionType>(
        nodeUrl: string
    ): Promise<Array<InfoMap[T]>> =>
        Promise.all(
            list.map((param) =>
                param.type === NAME_MAP.cancelLease
                    ? fetchInfo(nodeUrl, param.leaseId)
                    : Promise.resolve<any>(void 0)
            )
        );

    return Promise.all([
        transactionsWithFee,
        loadAssets.then(loadLogoInfo(state.networkByte)),
        fetchFeeList,
        loadAliases(state.nodeUrl, aliases),
        loadInfo(state.nodeUrl),
    ]).then(([transactions, assets, feeList, aliases, info]) =>
        transactions.map((tx, index) => ({
            meta: {
                feeList: feeList[index],
                aliases,
                assets: indexBy(prop('assetId'), assets),
                params: list[index],
                info: info[index],
            },
            tx: { ...tx, fee: list[index].fee ?? tx.fee },
        }))
    ) as any; // TODO
};
