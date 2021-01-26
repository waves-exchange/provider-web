import React, { FC } from 'react';
import { Box, Flex, Text } from '@waves.exchange/react-uikit';
import { WithId, Long, Transaction } from '@waves/ts-types';

type TransactionDetailsProps = {
    tx: Transaction<Long> & WithId;
};

export const TransactionDetails: FC<TransactionDetailsProps> = ({ tx }) => (
    <Box>
        <Flex
            justifyContent="space-between"
            py="14px"
            borderBottom="1px solid"
            borderTop="1px solid"
            borderColor="main.$700"
        >
            <Text variant="body2" color="basic.$500">
                Type
            </Text>
            <Text variant="body2" color="standard.$0">
                {tx.type}
            </Text>
        </Flex>
        <Flex
            justifyContent="space-between"
            py="14px"
            borderBottom="1px solid"
            borderColor="main.$700"
        >
            <Text variant="body2" color="basic.$500">
                Version
            </Text>
            <Text variant="body2" color="standard.$0">
                {tx.version}
            </Text>
        </Flex>
        <Flex
            justifyContent="space-between"
            py="14px"
            borderBottom="1px solid"
            borderColor="main.$700"
        >
            <Text variant="body2" color="basic.$500">
                TX Id
            </Text>
            <Text variant="body2" color="standard.$0">
                {tx.id}
            </Text>
        </Flex>
        <Flex
            justifyContent="space-between"
            py="14px"
            borderBottom="1px solid"
            borderColor="main.$700"
        >
            <Text variant="body2" color="basic.$500">
                Timestamp
            </Text>
            <Text variant="body2" color="standard.$0">
                {tx.timestamp}
            </Text>
        </Flex>
    </Box>
);
