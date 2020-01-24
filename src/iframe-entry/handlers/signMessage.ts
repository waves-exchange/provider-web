import { IUser } from '../../interface';
import { Queue } from '../../utils/Queue';
import { IState } from '../interface';
import login from '../router/login';
import { loadUserData, preload, toQueue } from './helpers';
import signMessage from '../router/signMessage';

export const getSignMessageHandler = (
    queue: Queue,
    state: IState
): ((message: string | number) => Promise<string>) =>
    toQueue(queue, (message: string | number) => {
        preload();

        return login(state)()
            .then(() => loadUserData(state as IState<IUser>))
            .then((state) => signMessage(message, state));
    });
