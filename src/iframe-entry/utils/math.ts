import { TLong } from '@waves/signer';
import BigNumber from '@waves/bignumber';

export const getPrintableNumber = (number: TLong, decimals: number): string => {
    return BigNumber.toBigNumber(number)
        .div(Math.pow(10, decimals))
        .roundTo(decimals)
        .toFixed();
};

export const getCoins = (n: TLong, decimals: number): string => {
    return BigNumber.toBigNumber(n)
        .mul(Math.pow(10, decimals))
        .toFixed();
};
