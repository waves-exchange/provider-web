import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import {
    Box,
    CopyLabel,
    Flex,
    Icon,
    iconSignMessage,
    Text,
} from '@waves.exchange/react-uikit';

interface SignMessageComponentProps {
    userAddress: string;
    userName: string;
    userBalance: string;
    data: string;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
}

export const SignMessageComponent: FC<SignMessageComponentProps> = ({
    userAddress,
    userName,
    userBalance,
    data,
    onReject,
    onConfirm,
}) => {
    return (
        <Confirmation
            address={userAddress}
            name={userName}
            balance={userBalance}
            onReject={onReject}
            onConfirm={onConfirm}
        >
            <Flex px="$40" py="$20" bg="main.$900">
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="circle"
                    bg="rgba(255, 175, 0, 0.1)"
                    height={60}
                    width={60}
                >
                    <Icon
                        size="60px"
                        icon={iconSignMessage}
                        color="primary.$300"
                    />
                </Flex>
                <Flex ml="$20" flexDirection="column">
                    <Text variant="body1" color="basic.$500">
                        Off-chain
                    </Text>
                    <Text fontSize={26} lineHeight="32px" color="standard.$0">
                        Sign Message
                    </Text>
                </Flex>
            </Flex>

            <Flex
                px="$40"
                py="$30"
                flexDirection="column"
                bg="main.$800"
                borderTop="1px solid"
                borderTopColor="basic.$1000"
            >
                <Text variant="body2" color="basic.$500" mb="$5">
                    Message
                </Text>
                <Flex
                    bg="basic.$900"
                    borderRadius="$4"
                    py="15px"
                    pl="15px"
                    pr="5px"
                    flexDirection="column"
                    alignItems="flex-end"
                >
                    <Box
                        width="100%"
                        maxHeight="147px"
                        overflow="hidden"
                        overflowY="auto"
                        pr="10px"
                    >
                        <Text variant="body2" color="standard.$0">
                            {data}
                        </Text>
                    </Box>
                    <CopyLabel text={data} mr="15px" />
                </Flex>
            </Flex>
        </Confirmation>
    );
};
