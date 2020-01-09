import { IUserData } from '@waves/signer';
import nthArg from 'ramda/es/nthArg';
import pipe from 'ramda/es/pipe';
import tap from 'ramda/es/tap';
import applySpec from 'ramda/es/applySpec';
import { IState } from '../interface';
import login from '../router/login';
import { TMiddleware } from '../utils/middleware';
import { libs } from '@waves/waves-transactions';
import { analytics } from '../utils/analytics';
import then from 'ramda/es/then';
import prop from 'ramda/es/prop';

export const loginMW: TMiddleware<IState, void, Promise<IUserData>> = pipe(
    nthArg(0),
    login,
    tap(
        then(
            pipe(
                prop('address'),
                applySpec({
                    auuid: pipe(
                        nthArg(0),
                        libs.crypto.stringToBytes,
                        libs.crypto.blake2b,
                        libs.crypto.base64Encode
                    ),
                }),
                analytics.addDefaultParams.bind(analytics)
            )
        )
    )
);
