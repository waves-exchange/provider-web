import { IUserData } from '@waves/signer';
import { libs } from '@waves/waves-transactions';
import pipe from 'ramda/es/pipe';
import { Queue } from '../../utils/Queue';
import { IState } from '../interface';
import login from '../router/login';
import { analytics } from '../utils/analytics';
import { preload, toQueue } from './helpers';

export const getLoginHandler = (
    queue: Queue,
    state: IState
): (() => Promise<IUserData>) =>
    toQueue(queue, () => {
        preload();

        return login(state)().then((user) => {
            analytics.addDefaultParams({
                auuid: pipe(
                    libs.crypto.stringToBytes,
                    libs.crypto.blake2b,
                    libs.crypto.base64Encode
                )(user.address, undefined),
            });

            return user;
        });
    });
