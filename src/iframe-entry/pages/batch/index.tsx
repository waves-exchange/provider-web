import { AddressAvatar } from '@waves.exchange/react-uikit';
import { ITransactionInfo } from '../../services/transactionsService';
import React from 'react';
import { TTransactionParamWithType } from '@waves/signer';

export default function(props: IProps) {
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
                <span>Batch</span>
            </div>
            <div>
                <span>Transaction Count</span>
                <span>{props.list.length}</span>
            </div>
            <div>
                <button onClick={props.onCancel}>Cancel</button>
                <button onClick={props.onConfirm}>Ok</button>
            </div>
        </div>
    );
}

export interface IProps {
    sender: string;
    networkByte: number;
    user: {
        address: string;
        publicKey: string;
    };
    list: Array<ITransactionInfo<TTransactionParamWithType>>;
    onConfirm: () => void;
    onCancel: () => void;
}
