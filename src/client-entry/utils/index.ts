import { IWithId, TTransaction } from '@waves/ts-types';
import {
    TLong,
    TTransactionParamWithType,
} from '@waves/waves-js/dist/src/interface';
import {
    calculateFee,
    TFeeInfo,
} from '@waves/blockchain-api/dist/cjs/api-node/transactions';
import {
    details,
    TAssetDetails,
} from '@waves/blockchain-api/dist/cjs/api-node/assets';
import {
    indexBy,
    map,
    prop,
    switchTransactionByType,
    uniq,
} from '@waves/blockchain-api/dist/cjs/tools/utils';
import { libs, makeTx } from '@waves/waves-transactions';
import { IState } from '../index';
import { MAX_ALIAS_LENGTH, NAME_MAP, WAVES } from '../../constants';
import { BigNumber } from '@waves/bignumber';
import availableSponsoredBalances, {
    TAssetFeeInfo,
} from '@waves/blockchain-api/dist/cjs/tools/adresses/availableSponsoredBalances';
import getAssetIdListByTx from '@waves/blockchain-api/dist/cjs/tools/adresses/getAssetIdListByTx';
import { IUser } from '../../interface';

export const toArray = <T>(data: T | Array<T>): Array<T> =>
    Array.isArray(data) ? data : [data];

export function toFormat(
    data: TLong,
    id: string | null,
    hash: Record<string, TAssetDetails>
): string {
    const asset = id != null ? hash[id] : WAVES;

    if (asset == null) {
        throw new Error('Asset not found!');
    }

    return (
        BigNumber.toBigNumber(data)
            .div(Math.pow(10, asset.decimals))
            .roundTo(asset.decimals)
            .toFixed() + ` ${asset.name}`
    );
}

function fixRecipient<T extends { recipient: string }>(
    state: IState<unknown>
): (data: T) => T;
function fixRecipient<T extends { recipient: string }>(
    state: IState<unknown>,
    data: T
): T;
function fixRecipient<T extends { recipient: string }>(
    state: IState<unknown>,
    data?: T
): T | ((data: T) => T) {
    const apply = (data: T): T => {
        const origin = data.recipient.replace(/alias:.:/, '');

        if (origin.length > MAX_ALIAS_LENGTH) {
            return { ...data, recipient: origin };
        } else {
            return {
                ...data,
                recipient: `alias:${String.fromCharCode(
                    state.networkByte
                )}:${origin}`,
            };
        }
    };

    return data != null ? apply(data) : apply;
}

function createTxFactory(state: IState<IUser>) {
    const updateRecipient = fixRecipient(state);

    return switchTransactionByType({
        [NAME_MAP.transfer]: updateRecipient,
        [NAME_MAP.massTransfer]: (tx) => ({
            ...tx,
            transfers: map(updateRecipient),
        }),
        [NAME_MAP.lease]: updateRecipient,
    });
}

async function prepareTransaction(
    state: IState<IUser>,
    origin: TTransactionParamWithType<TLong>
): Promise<TTransactionData> {
    const factory = createTxFactory(state);

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    origin = (factory(origin as any) || origin) as any;

    try {
        const extended = makeTx({
            chainId: state.networkByte,
            ...origin,
            senderPublicKey: libs.crypto.publicKey(state.user.seed),
        } as any) as TTransaction<TLong> & IWithId;

        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        const feeData: TFeeInfo = await (origin.fee
            ? Promise.resolve({ feeAssetId: null, feeAmount: extended.fee })
            : calculateFee(state.nodeUrl, extended as any).catch(() => ({
                  feeAssetId: null,
                  feeAmount: extended.fee,
              })));

        const feeList: TAssetFeeInfo[] = await (origin.type ===
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            NAME_MAP.transfer && !origin.fee
            ? availableSponsoredBalances(
                  state.nodeUrl,
                  state.user.address,
                  feeData.feeAmount
              ).catch(() => [])
            : Promise.resolve([]));

        const assets = await details(
            state.nodeUrl,
            uniq(
                getAssetIdListByTx(extended).concat(
                    feeList.map(prop('assetId'))
                )
            )
        );
        const hash = indexBy(prop('assetId'), assets);

        return {
            origin,
            extended,
            assets: hash,
            feeList: [
                feeData,
                ...feeList.map((item) => ({
                    feeAssetId: item.assetId,
                    feeAmount: item.assetFee,
                })),
            ],
        };
    } catch (e) {
        return Promise.reject(e);
    }
}

export function prepareTransactions(
    state: IState<IUser>,
    list: Array<TTransactionParamWithType<TLong>>
): Promise<Array<TTransactionData>> {
    return Promise.all(list.map((tx) => prepareTransaction(state, tx)));
}

export interface TTransactionData {
    origin: TTransactionParamWithType<TLong>;
    extended: TTransaction<TLong> & IWithId;
    assets: Record<string, TAssetDetails>;
    feeList: Array<TFeeInfo>;
}
