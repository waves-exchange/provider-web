import { Box, Text } from '@waves.exchange/react-uikit';
import React, { FC } from 'react';

type DataJsonProps = {
    data: any;
};

export const DataJson: FC<DataJsonProps> = ({ data }) => (
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
            {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
        </Text>
    </Box>
);
