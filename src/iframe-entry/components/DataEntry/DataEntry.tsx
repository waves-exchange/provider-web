import { Box, Flex, Text } from '@waves.exchange/react-uikit';
import { IData } from '@waves/signer';
import React, { FC } from 'react';

type DataEntryProps = {
    data: IData['data'];
};

export const DataEntry: FC<DataEntryProps> = ({ data }) => (
    <Box mb="$20" px="15px" bg="basic.$900" borderRadius="$4">
        <Flex py="13px" borderBottom="1px solid" borderColor="main.$500">
            <Box width="35%">
                <Text variant="body2" color="basic.$500">
                    Key
                </Text>
            </Box>
            <Box width="50%">
                <Text variant="body2" color="basic.$500">
                    Value
                </Text>
            </Box>
            <Box width="15%">
                <Text variant="body2" color="basic.$500">
                    Type
                </Text>
            </Box>
        </Flex>
        <Box maxHeight="165px" overflow="hidden" overflowY="auto" mr="5px">
            {data.map((item, i) => (
                <Flex
                    key={item.key}
                    borderTop={i === 0 ? 0 : '1px dashed'}
                    borderColor="main.$500"
                    py="13px"
                >
                    <Box width="35%">
                        <Text
                            variant="body2"
                            color="standard.$0"
                            isTruncated={true}
                            display="inline-block"
                            maxWidth="100%"
                            pr="$20"
                            verticalAlign="middle"
                        >
                            {item.key}
                        </Text>
                    </Box>
                    <Box width="50%">
                        <Text
                            variant="body2"
                            color="standard.$0"
                            isTruncated={true}
                            display="inline-block"
                            maxWidth="100%"
                            pr="$20"
                            verticalAlign="middle"
                        >
                            {String(item.value)}
                        </Text>
                    </Box>
                    <Box width="15%">
                        <Text variant="body2" color="standard.$0">
                            {item['type'] || ''}
                        </Text>
                    </Box>
                </Flex>
            ))}
        </Box>
    </Box>
);
