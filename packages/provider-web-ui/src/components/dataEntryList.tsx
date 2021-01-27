import React from 'react';
import { TypedData } from '@waves/signer';

export default function (props: {
    data: Array<TypedData>;
}): React.ReactElement {
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
