import React, { FC, ReactElement } from 'react';
import {
    Icon,
    IconProps,
    iconTransferArrow,
    iconTransferCircle,
    iconMassTransfer,
} from '@waves.exchange/react-uikit';

export type IconTransferType = 'send' | 'receive' | 'circular' | 'mass';

export const IconTransfer: FC<
    { type: IconTransferType } & Omit<IconProps, 'icon'>
> = ({ type, ...rest }): ReactElement | null => {
    switch (type) {
        case 'mass':
            return <Icon icon={iconMassTransfer} color="#FFAF00" {...rest} />;
        case 'send':
            return <Icon icon={iconTransferArrow} color="#FFAF00" {...rest} />;
        case 'receive':
            return (
                <Icon
                    sx={{ transform: 'rotate(180deg)' }}
                    icon={iconTransferArrow}
                    color="#81C926"
                    {...rest}
                />
            );
        case 'circular':
            return <Icon icon={iconTransferCircle} color="#EF4829" {...rest} />;
        default:
            return null;
    }
};
