import { IState } from '../index';
import renderPage from '../utils/renderPage';
import { TLong } from '@waves/waves-js/dist/src/interface';
import batchPage from '../pages/batch';
import { IWithId, TTransactionWithProofs } from '@waves/ts-types';
import { libs, signTx } from '@waves/waves-transactions';
import { TTransactionData } from '../utils';
import { IUser } from '../../interface';

export default function(
    list: Array<TTransactionData>,
    state: IState<IUser>
): Promise<Array<TTransactionWithProofs<TLong> & IWithId>> {
    return new Promise((resolve, reject) => {
        renderPage(
            batchPage({
                networkByte: state.networkByte,
                sender: state.user.address,
                user: {
                    address: state.user.address,
                    publicKey: libs.crypto.publicKey(state.user.seed),
                },
                list,
                onConfirm: () => {
                    resolve(
                        list.map((item) =>
                            signTx(item.extended as any, state.user.seed)
                        ) as any
                    ); // TODO Fix types
                },
                onCancel: () => {
                    reject(new Error('User rejection!'));
                },
            })
        );
    });
}
