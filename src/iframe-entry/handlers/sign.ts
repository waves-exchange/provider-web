import { TLong, TTransactionParamWithType } from '@waves/signer';
import { IWithId, TTransactionWithProofs } from '@waves/ts-types';
import pipe from 'ramda/es/pipe';
import { IUser } from '../../interface';
import { Queue } from '../../utils/Queue';
import { IState } from '../interface';
import login from '../router/login';
import sign from '../router/sign';
import { loadUserData, preload, toQueue } from './helpers';

export const getSignHandler = (
    queue: Queue,
    state: IState
): ((
    list: Array<TTransactionParamWithType>
) => Promise<Array<TTransactionWithProofs<TLong> & IWithId>>) =>
    toQueue(
        queue,
        pipe<
            Array<TTransactionParamWithType>,
            Array<TTransactionParamWithType>,
            Promise<Array<TTransactionWithProofs<TLong> & IWithId>>
        >(preload, (list: Array<TTransactionParamWithType>) =>
            login(state)()
                .then(() => loadUserData(state as IState<IUser>))
                .then((state) => sign(list, state))
        )
    );
