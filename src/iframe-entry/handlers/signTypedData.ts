import { IUser } from '../../interface';
import { Queue } from '../../utils/Queue';
import { IState } from '../interface';
import login from '../router/login';
import { loadUserData, preload, toQueue } from './helpers';
import signTypedData from '../router/signTypedData';
import { ITypedData } from '@waves/signer';

export const getSignTypedDataHandler = (
    queue: Queue,
    state: IState
): ((data: Array<ITypedData>) => Promise<string>) =>
    toQueue(queue, (data: Array<ITypedData>) => {
        preload();

        return login(state)()
            .then(() => loadUserData(state as IState<IUser>))
            .then((state) => signTypedData(data, state));
    });
