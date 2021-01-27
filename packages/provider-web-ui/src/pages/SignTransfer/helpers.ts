import BigNumber from '@waves/bignumber';
import { TRANSACTION_NAME_MAP } from '@waves/node-api-js/es/interface';
import { Long, Transaction } from '@waves/ts-types';
import { IMassTransferItem, libs } from '@waves/waves-transactions';
import { DetailsWithLogo, IMeta } from '../../interface';
import { NAME_MAP, WAVES } from '../../constants';
import { isAlias } from '../../utils/isAlias';
import { getPrintableNumber } from '../../utils/math';
import { TransferMeta, TransferType } from './SignTransferContainer';

type TxType =
    | TRANSACTION_NAME_MAP['transfer']
    | TRANSACTION_NAME_MAP['massTransfer'];
type Asset = Pick<DetailsWithLogo, 'name' | 'assetId' | 'decimals'>;
export type MetaAssets = Record<string, Asset>;
export type MetaAliases = Record<string, string>;

type GetAmountAsset = (
    assetId: string | null | undefined,
    assets: MetaAssets
) => Asset;

export const getAmountAsset: GetAmountAsset = (assetId, assets) =>
    assetId === null || assetId === undefined
        ? (WAVES as Asset)
        : assets[assetId];

type GetAssetName = (
    assetId: string | null | undefined,
    assets: MetaAssets
) => string;

export const getAssetName: GetAssetName = (assetId, assets) => {
    return assetId === null || assetId === 'WAVES' || assetId === undefined
        ? WAVES.name
        : assets[assetId].name;
};

type GetFeeAsset = (
    txType: TxType,
    assets: MetaAssets,
    txFeeAssetId?: string | null
) => Asset;

export const getFeeAsset: GetFeeAsset = (txType, assets, txFeeAssetId) => {
    if (
        // Mass Transfer or feeAssetId === Waves
        txType === 11 ||
        txFeeAssetId === null ||
        typeof txFeeAssetId === 'undefined'
    ) {
        return WAVES as Asset;
    }

    return assets[txFeeAssetId];
};

type GetRecipientAddress = (recipient: string, aliases: MetaAliases) => string;

export const getRecipientAddress: GetRecipientAddress = (
    recipient,
    aliases
): string => (isAlias(recipient) ? aliases[recipient] : recipient);

type Recepient = { name: string; address: string };
type RawTransferListItem = Recepient & {
    amount: Long;
};
type GetRawTransferList = (
    aliases: MetaAliases,
    massTransfers: IMassTransferItem<Long>[]
) => RawTransferListItem[];

export const getRawTransfersList: GetRawTransferList = (
    aliases,
    massTransfers
) => {
    return massTransfers.map(({ amount, recipient }) => ({
        name: recipient,
        address: getRecipientAddress(recipient, aliases),
        amount: amount,
    }));
};

type GetTotalTransferAmount = (
    rawTransferList: RawTransferListItem[],
    decimals: number
) => string;

export const getTotalTransferAmount: GetTotalTransferAmount = (
    rawTransferList,
    decimals
) => {
    const sum = rawTransferList.reduce((sum, { amount }) => {
        return BigNumber.toBigNumber(amount).add(sum);
    }, BigNumber.toBigNumber(0));

    return getPrintableNumber(sum.toString(), decimals);
};

export type TransferListItem = Recepient & {
    amount: string;
};

type GetTransferList = (
    rawTransferList: RawTransferListItem[],
    decimals: number
) => TransferListItem[];

export const getTransferList: GetTransferList = (rawTransferList, decimals) =>
    rawTransferList.map((item) => ({
        ...item,
        amount: getPrintableNumber(item.amount, decimals),
    }));

type GetFeeAssetName = (
    txType: TxType,
    assets: MetaAssets,
    feeAssetId?: string | null
) => string;

export const getFeeAssetName: GetFeeAssetName = (
    txType,
    assets,
    feeAssetId
) => {
    return txType === 11 || feeAssetId === 'undefined' || feeAssetId === null
        ? WAVES.name
        : getAssetName(getFeeAsset(txType, assets, feeAssetId).assetId, assets);
};

type TransferViewData = {
    totalTransferAmount: string;
    transferList: TransferListItem[];
    fee: string;
    attachment: string;
};

type GetPrintableTxFee = (args: {
    txType: TxType;
    txFee: Long;
    assets: MetaAssets;
    txFeeAssetId?: string | null;
}) => string;

export const getPrintableTxFee: GetPrintableTxFee = ({
    txType,
    txFee,
    assets,
    txFeeAssetId,
}) =>
    `${getPrintableNumber(
        txFee,
        getFeeAsset(txType, assets, txFeeAssetId).decimals
    )} ${getFeeAssetName(txType, assets, txFeeAssetId)}`;

type GetTransferViewData = (args: {
    txRecipient: string;
    txAssetId?: string | null;
    txFee: Long;
    txFeeAssetId: string | null;
    txAmount: Long;
    assets: Record<string, Asset>;
    aliases: Record<string, string>;
}) => Omit<TransferViewData, 'attachment'>;

export const getTransferViewData: GetTransferViewData = ({
    txRecipient,
    txAssetId,
    txFee,
    txFeeAssetId,
    txAmount,
    assets,
    aliases,
}) => {
    const { name, decimals } = getAmountAsset(txAssetId, assets);

    return {
        totalTransferAmount: `${getPrintableNumber(
            txAmount,
            decimals
        )} ${name}`,
        transferList: [
            {
                name: txRecipient,
                address: getRecipientAddress(txRecipient, aliases),
                amount: getPrintableNumber(txAmount, decimals),
            },
        ],
        fee: getPrintableTxFee({
            txType: NAME_MAP.transfer,
            txFee,
            assets,
            txFeeAssetId,
        }),
    };
};

type GetMassTransferViewData = (args: {
    txTransfers: IMassTransferItem<Long>[];
    txAssetId?: string | null;
    txFee: Long;
    assets: Record<string, Asset>;
    aliases: Record<string, string>;
}) => Omit<TransferViewData, 'attachment'>;

export const getMassTransferViewData: GetMassTransferViewData = ({
    txTransfers,
    txAssetId,
    txFee,
    assets,
    aliases,
}) => {
    const { name, decimals } = getAmountAsset(txAssetId, assets);

    const rawTransferList = getRawTransfersList(aliases, txTransfers);

    return {
        totalTransferAmount: `${getTotalTransferAmount(
            rawTransferList,
            decimals
        )} ${name}`,
        transferList: getTransferList(rawTransferList, decimals),
        fee: getPrintableTxFee({
            txType: NAME_MAP.transfer,
            txFee,
            assets,
        }),
    };
};

type GetViewData = (tx: TransferType, meta: TransferMeta) => TransferViewData;

export const getViewData: GetViewData = (tx, { aliases, assets }) => {
    const transferViewData =
        tx.type === 4
            ? getTransferViewData({
                  aliases: aliases,
                  assets: assets,
                  txAssetId: tx.assetId,
                  txRecipient: tx.recipient,
                  txAmount: tx.amount,
                  txFee: tx.fee,
                  txFeeAssetId: tx.feeAssetId,
              })
            : getMassTransferViewData({
                  aliases: aliases,
                  assets: assets,
                  txAssetId: tx.assetId,
                  txTransfers: tx.transfers,
                  txFee: tx.fee,
              });

    let attachment = '';

    try {
        attachment = libs.crypto.bytesToString(
            libs.crypto.base58Decode(tx?.attachment || '')
        );
    } catch (e) {
        // Do not have to do anything
    }

    return {
        ...transferViewData,
        attachment,
    };
};

export const isTransferMeta = (
    meta: IMeta<Transaction>
): meta is TransferMeta => meta.params.type === NAME_MAP.transfer;
