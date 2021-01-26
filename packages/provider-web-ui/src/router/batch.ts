import { SignerTx } from '@waves/signer';
import { Transaction } from '@waves/ts-types';
import { libs, signTx } from '@waves/waves-transactions';
import { ITransactionInfo, IUser } from '../interface';
import { IState } from '../interface';
import batchPage from '../pages/batch';
import renderPage from '../utils/renderPage';

export default function (
    list: Array<ITransactionInfo<Transaction>>,
    state: IState<IUser>
): Promise<Array<SignerTx>> {
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
