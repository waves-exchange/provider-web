import React, { FC } from 'react';
import { Flex, Avatar, Copy, Text } from '@waves.exchange/react-uikit';

type Props = {
    address: string;
    userName?: string;
    alias: string;
};

export const Account: FC<Props> = ({ address, userName, alias }) => {
    return (
        <Flex alignItems="center" mt="$5">
            <Avatar address={address} variantSize="large" />
            <Flex ml="$10" flexDirection="column" justifyContent="center">
                {userName && (
                    <Text variant="footnote1" color="basic.$500">
                        {userName}
                    </Text>
                )}
                <Copy
                    inititialTooltipLabel="Copy address"
                    copiedTooltipLabel="Copied!"
                    text={alias}
                />
            </Flex>
        </Flex>
    );
};
