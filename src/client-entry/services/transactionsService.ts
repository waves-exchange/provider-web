import { TTransactionParamWithType, TLong } from '@waves/waves-js/dist/src/interface';
import { TTransaction, IWithId } from '@waves/ts-types';
import { getTransactionFromParams } from '../utils/getTransactionFromParams';
import { IState } from '..';
import { IUser } from '../../interface';
import curry from 'ramda/es/curry';
import indexBy from 'ramda/es/indexBy';
import prop from 'ramda/es/prop';
// import flatten from 'ramda/es/flatten';
// import pipe from 'ramda/es/pipe';
// import map from 'ramda/es/map';
import { TFeeInfo, calculateFee } from '@waves/blockchain-api/dist/cjs/api-node/transactions';
import getAssetIdListByTx from '@waves/blockchain-api/dist/cjs/tools/adresses/getAssetIdListByTx';
import { details, TAssetDetails } from '@waves/blockchain-api/dist/cjs/api-node/assets';
import { NAME_MAP } from '@waves/blockchain-api/dist/cjs/constants';
import { isAddress } from '../utils/isAddress';

const getFee = curry((
    state: IState<IUser>,
    tx: TTransaction<TLong> & IWithId
): Promise<TFeeInfo> =>
    tx.fee == null
        ? calculateFee(state.nodeUrl, tx)
            .catch(() => ({ feeAssetId: null, feeAmount: undefined }))
        : Promise.resolve({ feeAssetId: null, feeAmount: undefined }));

const getAliasByTx = (tx: TTransaction<TLong> & IWithId): Array<string> => {
    switch (tx.type) {
        case NAME_MAP.transfer:
        case NAME_MAP.lease:
            return isAddress(tx.recipient) ? [] : [tx.recipient];
        case NAME_MAP.massTransfer:
            return tx.transfers.reduce((acc, transfer) => {
                if (!isAddress(transfer.recipient)) {
                    acc.push(transfer.recipient);
                }
                return acc;
            }, []);
        default:
            return [];
    }
}

// const uniqString = (list: Array<string>): Array<string> =>
//     Object.keys(list.reduce((acc, item) => Object.assign(acc, { [item]: true }), {}))

export const prepareTransactions = (
    state: IState<IUser>,
    list: Array<TTransactionParamWithType>
): Promise<Array<{ meta: TMeta, tx: TTransaction<TLong> & IWithId }>> => {
    const mekeTx = getTransactionFromParams(state);
    const transactions = list.map(mekeTx);
    const currentFee = getFee(state);
    const assetsIdList = getAssetIdListByTx(transactions);
    // const aliases = pipe(
    //     map(getAliasByTx),
    //     flatten,
    //     uniqString
    // )(transactions);

    const promises: [
        Array<Promise<TFeeInfo>>,
        // Array<Promise<{ address: string }>>,
        Promise<Array<TAssetDetails>>
    ] = [
            transactions.map(currentFee),
            //aliases.map(() => null as any), TODO
            details(state.nodeUrl, assetsIdList)
        ];

    return Promise.all(promises)
        .then(([feeInfoList, assets]) =>
            transactions.map((tx, index) => ({
                meta: {
                    aliases: {},
                    assets: indexBy(prop('assetId'), assets)
                },
                tx
            })));
}

export type TMeta = {
    aliases: Record<string, string>,
    assets: Record<string, TAssetDetails>
}
