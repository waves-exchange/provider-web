import { WAVES } from '../../constants';
import { TransferTx, TransferMeta } from './SignTransferContainer';
import { DetailsWithLogo } from '../../utils/loadLogoInfo';
import { getPrintableNumber } from '../../utils/math';
import { isAlias } from '../../utils/isAlias';
import { TLong, ITransferWithType } from '@waves/signer';
import BigNumber from '@waves/bignumber';
import { catchable } from '../../utils/catchable';
import { libs } from '@waves/waves-transactions';
import { compose } from 'ramda';
import { TAssetDetails } from '@waves/node-api-js/es/api-node/assets';
import { IMeta } from '../../services/transactionsService';

export const isTransferMeta = (
    meta: TransferMeta
): meta is IMeta<ITransferWithType> => meta.params.type === 4;

type GetAssetName = (
    assets: Record<string, TAssetDetails<TLong>>,
    assetId: string | null
) => string;
const getAssetName: GetAssetName = (assets, assetId) =>
    assetId !== null ? assets[assetId].name : WAVES.name;

type GetFeeAsset = (tx: TransferTx, meta: TransferMeta) => DetailsWithLogo;
export const getFeeAsset: GetFeeAsset = (tx, meta) => {
    // Mass Transfer or feeAssetId === Waves
    if (tx.type === 11 || tx.feeAssetId === null) {
        return WAVES;
    }

    return meta.assets[tx.feeAssetId];
};

const getRecipientAddress = (recipient: string, meta: TransferMeta): string =>
    isAlias(recipient) ? meta.aliases[recipient] : recipient;

type Recepient = { name: string; address: string };

type RawTransferListItem = Recepient & {
    amount: TLong;
};

type GetRawTransferList = (
    tx: TransferTx,
    meta: TransferMeta
) => RawTransferListItem[];

export const getRawTransfersList: GetRawTransferList = (tx, meta) => {
    if (tx.type === 11) {
        return tx.transfers.map(({ amount, recipient }) => ({
            name: recipient,
            address: getRecipientAddress(recipient, meta),
            amount: amount,
        }));
    }

    return [
        {
            name: tx.recipient,
            address: getRecipientAddress(tx.recipient, meta),
            amount: tx.amount,
        },
    ];
};

export const getTotalTransferAmount = (
    rawTransferList: RawTransferListItem[],
    decimals: number
): string => {
    const sum = rawTransferList.reduce((sum, { amount }) => {
        return BigNumber.toBigNumber(amount).add(sum);
    }, BigNumber.toBigNumber(0));

    return getPrintableNumber(sum.toString(), decimals);
};

type TransferListItem = Recepient & {
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

type TransferViewData = {
    totalTransferAmount: string;
    transferList: TransferListItem[];
    fee: string;
    attachement: string;
};
type GetTransferViewData = (
    tx: TransferTx,
    meta: TransferMeta
) => TransferViewData;

export const getTransferViewData: GetTransferViewData = (tx, meta) => {
    const amountAsset = tx.assetId === null ? WAVES : meta.assets[tx.assetId];

    const rawTransferList = getRawTransfersList(tx, meta);
    const feeAsset = getFeeAsset(tx, meta);

    const attachement = catchable(
        compose(libs.crypto.bytesToString, libs.crypto.base58Decode)
    )(tx.attachment);

    return {
        totalTransferAmount: `${getTotalTransferAmount(
            rawTransferList,
            amountAsset.decimals
        )} ${amountAsset.name}`,
        transferList: getTransferList(rawTransferList, amountAsset.decimals),
        fee: `${getPrintableNumber(tx.fee, feeAsset.decimals)} ${
            tx.type === 11 ||
            tx.feeAssetId === 'undefined' ||
            tx.feeAssetId === null
                ? WAVES.ticker
                : getAssetName(meta.assets, feeAsset.assetId)
        }`,
        attachement: attachement.ok ? attachement.resolveData : '',
    };
};
