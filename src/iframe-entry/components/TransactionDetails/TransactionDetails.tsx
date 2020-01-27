import { Box, Flex, Text } from '@waves.exchange/react-uikit';
import { TTransactionWithId } from '@waves/ts-types';
import React, { FC } from 'react';

type TransactionDetailsProps = {
    tx: TTransactionWithId<unknown>;
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
