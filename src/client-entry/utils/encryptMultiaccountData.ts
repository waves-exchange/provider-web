import { TPrivateMultiaccountData } from '../services/storage';
import { libs } from '@waves/waves-transactions';
import usersToJson from './usersToJson';

export default (
    users: TPrivateMultiaccountData,
    passowrd: string,
    rounds = 5000
): string => libs.crypto.encryptSeed(usersToJson(users), passowrd, rounds);
