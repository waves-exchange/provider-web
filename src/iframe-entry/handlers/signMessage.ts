import { IUser } from '../../interface';
import { Queue } from '../../utils/Queue';
import { IState } from '../interface';
import signMessage from '../router/signMessage';
import { loadUserData, preload, toQueue } from './helpers';

export const getSignMessageHandler = (
    queue: Queue,
    state: IState
): ((message: string | number) => Promise<string>) =>
    toQueue(queue, (message: string | number) => {
        preload();

        return loadUserData(state as IState<IUser>).then((state) =>
            signMessage(message, state)
        );
    });
