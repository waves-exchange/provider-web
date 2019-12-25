import { IState } from '../interface';
import renderPage from '../utils/renderPage';
import { TLong, TTransactionParamWithType } from '@waves/signer';
import batchPage from '../pages/batch';
import { IWithId, TTransactionWithProofs } from '@waves/ts-types';
import { libs, signTx } from '@waves/waves-transactions';
import { IUser } from '../../interface';
import { ITransactionInfo } from '../services/transactionsService';

export default function(
    list: Array<ITransactionInfo<TTransactionParamWithType>>,
    state: IState<IUser>
): Promise<Array<TTransactionWithProofs<TLong> & IWithId>> {
    return new Promise((resolve, reject) => {
        renderPage(
            batchPage({
                networkByte: state.networkByte,
                sender: state.user.address,
                user: {
                    address: state.user.address,
                    publicKey: libs.crypto.publicKey({
                        privateKey: state.user.privateKey,
                    }),
                },
                list,
                onConfirm: () => {
                    resolve(
                        list.map((item) =>
                            signTx(item.tx as any, {
                                privateKey: state.user.privateKey,
                            })
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
