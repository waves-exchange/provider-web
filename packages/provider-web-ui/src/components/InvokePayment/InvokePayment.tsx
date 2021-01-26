import React, { FC } from 'react';
import { Flex, Text, AssetLogo } from '@waves.exchange/react-uikit';
import { IPayment } from '../../pages/SignInvoke/SignInvokeContainer';

type TProps = IPayment & { isLast: boolean };

export const InvokePayment: FC<TProps> = ({
    assetId,
    amount,
    name,
    logo,
    isLast,
}) => (
    <Flex
        alignItems="center"
        color="standard.$0"
        p="$10"
        borderBottomWidth={isLast ? '0' : '1px'}
        borderBottomColor="main.$500"
        borderBottomStyle="dashed"
    >
        <AssetLogo
            mr="$10"
            logo={logo}
            assetId={assetId}
            name={name}
            size={26}
        />
        <Text variant="body2">{name}</Text>
        <Text variant="body2" flex="2" textAlign="right">
            {amount}
        </Text>
    </Flex>
);
