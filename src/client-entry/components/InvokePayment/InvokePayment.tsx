import React, { FC } from 'react';
import { AssetLogo } from '@waves.exchange/react-uikit/dist/esm/components/AssetLogo/AssetLogo';
import { Flex, Text } from '@waves.exchange/react-uikit';
import { IPayment } from '../../pages/SignInvoke/page';

type TProps = IPayment & { isLast: boolean };

export const InvokePayment: FC<TProps> = ({
    assetId,
    amount,
    name,
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
        <AssetLogo mr="$10" variant="small" assetId={assetId} name={name} />
        <Text variant="body2">{name}</Text>
        <Text variant="body2" flex="2" textAlign="right">
            {amount}
        </Text>
    </Flex>
);
