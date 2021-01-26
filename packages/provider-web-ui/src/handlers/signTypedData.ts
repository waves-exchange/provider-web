import { TDataEntry } from '@waves/waves-transactions';
import { IUser } from '../interface';
import { IQueue } from '../utils/Queue';
import { IState } from '../interface';
import signTypedData from '../router/signTypedData';
import { loadUserData, preload, toQueue } from './helpers';

export const getSignTypedDataHandler = (
    queue: IQueue,
    state: IState
): ((data: Array<TDataEntry>) => Promise<string>) =>
    toQueue(queue, (data: Array<TDataEntry>) => {
        preload();

        return loadUserData(state as IState<IUser>).then((state) =>
            signTypedData(data, state)
        );
    });
