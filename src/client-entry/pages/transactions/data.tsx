import { AddressAvatar } from '@waves.exchange/react-uikit';
import React from 'react';
import { ISignTxProps } from '../../../interface';
import { IDataWithType } from '@waves/waves-js/dist/src/interface';
import { toFormat } from '../../utils';

export default function(props: ISignTxProps<IDataWithType>) {
    const tx = props.txInfo.tx;

    return (
        <div>
            <div onClick={props.onCancel} />
            <div className="logo" />
            <div>Confirm TX</div>
            <div>
                <span>Sign from</span>
                <span>
                    <AddressAvatar address={props.user.address} />
                </span>
            </div>
            <div>
                <span>Type</span>
                <span>Data</span>
            </div>
            <div>
                <span>Id</span>
                <span>{tx.id}</span>
            </div>
            <div>
                {tx.data.map((item) => (
                    <div>
                        <span>{item.key}</span>
                        <span>{item.type}</span>
                        <span>{item.value}</span>
                    </div>
                ))}
            </div>
            <div>
                <span>Fee</span>
                <span>{toFormat(tx.fee, null, props.txInfo.meta.assets)}</span>
            </div>
            <div>
                <button onClick={props.onCancel}>Cancel</button>
                <button onClick={() => props.onConfirm(tx)}>Ok</button>
            </div>
        </div>
    );
}
