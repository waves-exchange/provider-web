import { TLong, TTransactionParamWithType } from '@waves/signer';
import { IWithId, TTransactionWithProofs } from '@waves/ts-types';
import { IUser } from '../../interface';
import { Queue } from '../../utils/Queue';
import { IState } from '../interface';
import sign from '../router/sign';
import { loadUserData, preload, toQueue } from './helpers';

export const getSignHandler = (
    queue: Queue,
    state: IState
): ((
    list: Array<TTransactionParamWithType>
) => Promise<Array<TTransactionWithProofs<TLong> & IWithId>>) =>
    toQueue(queue, (list: Array<TTransactionParamWithType>) => {
        preload();

        return loadUserData(state as IState<IUser>).then((state) =>
            sign(list, state)
        );
    });
