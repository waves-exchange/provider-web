import { Flex } from '@waves.exchange/react-uikit';
import { Spinner } from '@waves.exchange/react-uikit/dist/esm/components/Spinner/Spinner';
import React from 'react';

export default function(): React.ReactElement {
    return (
        <Flex
            backgroundColor="main.$800"
            width="520px"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            borderRadius="$6"
            height="584px"
        >
            <Spinner />
        </Flex>
    );
}
