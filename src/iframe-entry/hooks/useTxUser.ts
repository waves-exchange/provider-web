import { IUserWithBalances } from '../../interface';
import { getUserName } from '../services/userService';
import { WAVES } from '../constants';
import { getPrintableNumber } from '../utils/math';

export const useTxUser = (
    user: Omit<IUserWithBalances, 'seed'> & { publicKey: string },
    networkByte: number
): { userName: string; userBalance: string } => {
    const userName = getUserName(networkByte, user.publicKey);
    const userBalance = getPrintableNumber(user.balance, WAVES.decimals);

    return { userName, userBalance };
};
