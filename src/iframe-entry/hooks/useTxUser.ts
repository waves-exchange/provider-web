import { IUserWithBalances } from '../../interface';
import BigNumber from '@waves/bignumber';
import { WAVES } from '../../constants';
import { getUserName } from '../services/userService';

export const useTxUser = (
    user: Omit<IUserWithBalances, 'seed'> & { publicKey: string },
    networkByte: number
): { userName: string; userBalance: string } => {
    const userName = getUserName(networkByte, user.publicKey);
    const userBalance = BigNumber.toBigNumber(user.balance)
        .div(Math.pow(10, WAVES.decimals))
        .toFixed();

    return { userName, userBalance };
};
