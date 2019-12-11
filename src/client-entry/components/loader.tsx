import React from 'react';
import { Box } from '@waves/react-uikit';

export default function(): React.ReactElement {
    return (
        <Box
            position="absolute"
            left="50%"
            top="50%"
            style={{ transform: 'translate(-50%, -50%)' }}
        >
            Loading...
        </Box>
    );
}
