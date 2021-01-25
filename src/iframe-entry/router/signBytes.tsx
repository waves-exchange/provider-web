import { IState } from '../interface';
import { IUser } from '../../interface';

export default function (
    _data: string,
    _state: IState<IUser>
): Promise<string> {
    return Promise.reject('Unsupported method!');
    // const base64 = data.startsWith('base64:') ? data : `base64:${data}`;
    // const signature = customData(
    //     {
    //         binary: base64,
    //         version: 1,
    //     },
    //     state.user.seed
    // ).signature;

    // return new Promise((resolve, reject) => {
    //     renderPage(
    //         React.createElement(signCustom, {
    //             networkByte: state.networkByte,
    //             title: 'dApp access sign of custom bytes',
    //             data: (
    //                 <div>
    //                     <span>Bytes</span>
    //                     <span>{data}</span>
    //                 </div>
    //             ),
    //             sender: state.user.address,
    //             onConfirm: () => {
    //                 resolve(signature);
    //             },
    //             onCancel: () => {
    //                 reject(new Error('User rejection!')); // TODO Add typed errors with codes
    //             },
    //         })
    //     );
    // });
}
