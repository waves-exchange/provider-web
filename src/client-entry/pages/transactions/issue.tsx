import { AddressAvatar } from '@waves.exchange/react-uikit';
import React from 'react';
import { ISignTxProps } from '../../../interface';
import { IIssueWithType } from '@waves/waves-js/dist/src/interface';
import { toFormat } from '../../utils';

export default function(props: ISignTxProps<IIssueWithType>) {
    const tx = props.tx.extended;

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
                <span>Issue</span>
            </div>
            <div>
                <span>Id</span>
                <span>{tx.id}</span>
            </div>
            <div>
                <span>Name</span>
                <span>{tx.name}</span>
            </div>
            <div>
                <span>Description</span>
                <span>{tx.description}</span>
            </div>
            <div>
                <span>Quantity</span>
                <span>{tx.quantity}</span>
            </div>
            <div>
                <span>Decimals</span>
                <span>{tx.decimals}</span>
            </div>
            <div>
                <span>Reissuable</span>
                <span>{tx.reissuable}</span>
            </div>
            <div>
                <span>Script</span>
                <span>{tx.script ?? 'No script'}</span>
            </div>
            <div>
                <span>Fee</span>
                <span>{toFormat(tx.fee, null, props.assets)}</span>
            </div>
            <div>
                <button onClick={props.onCancel}>Cancel</button>
                <button onClick={() => props.onConfirm(tx)}>Ok</button>
            </div>
        </div>
    );
}
