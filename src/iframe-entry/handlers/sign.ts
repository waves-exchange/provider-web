import { SignedTx, SignerTx } from '@waves/signer';
import { IUser } from '../../interface';
import { Queue } from '../../utils/Queue';
import { IState } from '../interface';
import sign from '../router/sign';
import { loadUserData, preload, toQueue } from './helpers';

export const getSignHandler = (
    queue: Queue,
    state: IState
): ((list: Array<SignerTx>) => Promise<Array<SignedTx<SignerTx>>>) =>
    toQueue(queue, (list: Array<SignerTx>) => {
        preload();

        return loadUserData(state as IState<IUser>).then((state) =>
            sign(list, state)
        );
    });
