import { AddressAvatar } from '@waves.exchange/react-uikit';
import React from 'react';
import { WithId } from '@waves/waves-transactions/src/transactions';
import { IInvokeScriptTransaction } from '@waves/waves-transactions';
import { ISignTxProps } from '../../../interface';
import { IInvokeWithType } from '@waves/waves-js/dist/src/interface';
import { toFormat } from '../../utils';
import { Confirmation } from '../../components/Confirmation';

export default function(
    props: ISignTxProps<IInvokeWithType>
): React.ReactElement {
    const tx = props.tx;

    return (
        <Confirmation
            address={props.user.address}
            name="Name"
            balance="123"
            onReject={props.onCancel}
            onConfirm={(): void => props.onConfirm(tx)}
        >
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
                    <span>Invoke Script</span>
                </div>
                <div>
                    <span>Id</span>
                    <span>{tx.id}</span>
                </div>
                <div>
                    <span>dApp address</span>
                    <span>
                        {tx.dApp} <AddressAvatar address={tx.dApp} />
                    </span>
                </div>
                <div>
                    <span>dApp function</span>
                    <span>{tx.call?.function ?? 'default'}</span>
                </div>
                <div>
                    <span>Function Arguments</span>
                    <span>
                        {tx.call?.args?.map((item) => (
                            <span>{item.value}</span>
                        )) ?? 'No arguments'}
                    </span>
                </div>
                <div>
                    <span>Payments</span>
                    <span>
                        {tx.payment?.map((item) => (
                            <span>
                                {toFormat(
                                    item.amount,
                                    item.assetId,
                                    props.meta.assets
                                )}
                            </span>
                        ))}
                    </span>
                </div>
                <div>
                    <span>Fee</span>
                    <span>{toFormat(tx.fee, null, props.meta.assets)}</span>
                </div>
                <div>
                    <button onClick={props.onCancel}>Cancel</button>
                    <button onClick={(): void => props.onConfirm(tx)}>
                        Ok
                    </button>
                </div>
            </div>
        </Confirmation>
    );
}

export interface IProps {
    networkByte: number;
    sender: string;
    tx: IInvokeScriptTransaction & WithId;
    onConfirm: () => void;
    onCancel: () => void;
}
