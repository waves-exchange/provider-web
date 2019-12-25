import React from 'react';
import { ITypedData } from '@waves/signer';

export default function(props: { data: Array<ITypedData> }) {
    return (
        <div className={'popup-fields-list'}>
            {props.data.map((item) => (
                <div>
                    <span>{item.type}</span>
                    <span>{item.key}</span>
                    <span>{item.value}</span>
                </div>
            ))}
        </div>
    );
}
