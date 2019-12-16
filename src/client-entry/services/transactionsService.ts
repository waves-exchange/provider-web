import {
    TTransactionParamWithType,
    TLong,
} from '@waves/waves-js/dist/src/interface';
import { TTransactionType } from '@waves/ts-types';
import { SPONSORED_TYPES } from '../../constants';
import { TTransaction, IWithId } from '@waves/ts-types';
import { getTransactionFromParams } from '../utils/getTransactionFromParams';
import { IUser } from '../../interface';
import curry from 'ramda/es/curry';
import indexBy from 'ramda/es/indexBy';
import prop from 'ramda/es/prop';
import {
    TFeeInfo,
    calculateFee,
} from '@waves/blockchain-api/dist/cjs/api-node/transactions';
import getAssetIdListByTx from '@waves/blockchain-api/dist/cjs/tools/adresses/getAssetIdListByTx';
import {
    details,
    TAssetDetails,
} from '@waves/blockchain-api/dist/cjs/api-node/assets';
import { IState } from '../interface';

const canBeSponsored = (tx: TTransaction<TLong> & IWithId): boolean =>
    SPONSORED_TYPES.includes(tx.type);

const getFee = curry(
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    (
        state: IState<IUser>,
        tx: TTransaction<TLong> & IWithId
    ): Promise<TFeeInfo> =>
        canBeSponsored(tx)
            ? calculateFee(state.nodeUrl, tx).catch(() => ({
                  feeAssetId: null,
                  feeAmount: tx.fee,
              }))
            : Promise.resolve({ feeAssetId: null, feeAmount: tx.fee })
);

// const getAliasByTx = (tx: TTransaction<TLong> & IWithId): Array<string> => {
//     switch (tx.type) {
//         case NAME_MAP.transfer:
//         case NAME_MAP.lease:
//             return isAddress(tx.recipient) ? [] : [tx.recipient];
//         case NAME_MAP.massTransfer:
//             return tx.transfers.reduce<Array<string>>((acc, transfer) => {
//                 if (!isAddress(transfer.recipient)) {
//                     acc.push(transfer.recipient);
//                 }

//                 return acc;
//             }, []);
//         default:
//             return [];
//     }
// };

// const uniqString = (list: Array<string>): Array<string> =>
//     Object.keys(list.reduce((acc, item) => Object.assign(acc, { [item]: true }), {}))

export const prepareTransactions = (
    state: IState<IUser>,
    list: Array<TTransactionParamWithType>
): Promise<Array<ITransactionInfo>> => {
    const mekeTx = getTransactionFromParams(state);
    const transactions = list.map(mekeTx);
    const currentFee = getFee(state);
    const assetsIdList = getAssetIdListByTx(transactions);

    return Promise.all(transactions.map(currentFee))
        .then((feeInfoList) => {
            feeInfoList.forEach((item) => {
                if (
                    item.feeAssetId != null &&
                    !assetsIdList.includes(item.feeAssetId)
                ) {
                    assetsIdList.push(item.feeAssetId as string);
                }
            });

            return Promise.all([
                feeInfoList,
                details(state.nodeUrl, assetsIdList),
            ]);
        })
        .then(([feeList, assets]) =>
            transactions.map((tx, index) => ({
                meta: {
                    feeList,
                    aliases: {},
                    assets: indexBy(prop('assetId'), assets),
                },
                tx: { ...tx, fee: list[index].fee ?? feeList[index].feeAmount },
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
