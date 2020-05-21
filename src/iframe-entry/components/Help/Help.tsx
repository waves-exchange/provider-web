import React, { FC, ReactNode } from 'react';
import {
    Tooltip,
    TooltipProps,
    Icon,
    iconQuestion,
    Box,
    Flex,
} from '@waves.exchange/react-uikit';

export const Help: FC<TooltipProps> = ({
    children,
    popperOptions,
    ...rest
}) => {
    return (
        <Tooltip
            arrowSize="4px"
            hasArrow={true}
            arrowColor="#5A81EA" // TODO научить тултип понимать цвета из темы
            offset={4}
            maxWidth="360px"
            label={(): ReactNode => (
                <Box
                    borderTop="4px solid"
                    borderTopColor="primary.$300"
                    backgroundColor="#4a5060" // TODO уточнить этот цвет
                    borderRadius="$4"
                    p={15}
                    color="standard.$0"
                    width="max-content"
                    maxWidth="400px"
                >
                    {children}
                </Box>
            )}
            placement="bottom"
            popperOptions={{
                ...popperOptions,
                modifiers: [
                    {
                        name: 'flip',
                        enabled: false,
                    },
                    ...((popperOptions && popperOptions['modifiers']) || []),
                ],
            }}
            {...rest}
        >
            <Flex
                size="14px"
                backgroundColor="basic.$500"
                borderRadius="circle"
                justifyContent="center"
                alignItems="center"
                cursor="pointer"
            >
                <Icon
                    iconSize="potty"
                    icon={iconQuestion}
                    color="standard.$1000"
                />
            </Flex>
        </Tooltip>
    );
};
