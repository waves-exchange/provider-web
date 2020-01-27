import { Box, Text } from '@waves.exchange/react-uikit';
import { TTransactionWithId } from '@waves/ts-types';
import React, { FC } from 'react';

type TransactionJsonProps = {
    tx: TTransactionWithId<unknown>;
};

export const TransactionJson: FC<TransactionJsonProps> = ({ tx }) => (
    <Box
        borderRadius="$4"
        bg="basic.$900"
        p="15px"
        maxHeight="165px"
        overflowY="auto"
        color="standard.$0"
    >
        <Text
            as="pre"
            m="0"
            variant="body2"
            fontFamily="Menlo, Monaco, Consolas, Courier New, monospace"
        >
            {JSON.stringify(tx, null, 2)}
        </Text>
    </Box>
);
