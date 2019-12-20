import React from 'react';
import {
    AddressAvatar,
    Box,
    Button,
    Flex,
    Text,
    TFlexProps,
} from '@waves.exchange/react-uikit';
import { FC, MouseEventHandler } from 'react';

type IConfirmationProps = TFlexProps & {
    address: string;
    name: string;
    balance: string;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
};

export const Confirmation: FC<IConfirmationProps> = ({
    address,
    name,
    balance,
    children,
    onReject,
    onConfirm,
    ...rest
}) => {
    return (
        <Flex
            backgroundColor="main.$800"
            maxWidth="520px"
            flexDirection="column"
            justifyContent="space-between"
            borderRadius="$6"
            {...rest}
        >
            <Flex
                px="$40"
                justifyContent="space-between"
                alignItems="center"
                height="65px"
                borderBottom="1px solid"
                borderBottomColor="basic.$1000"
            >
                <Box mr="$10">
                    <AddressAvatar
                        address={address}
                        isShort={true}
                        name={name}
                    />
                </Box>
                <Flex flexDirection="column" alignItems="flex-end">
                    <Text variant="footnote1" color="basic.$500">
                        Balance
                    </Text>
                    <Text variant="body2" color="standard.$0">
                        {balance}
                    </Text>
                </Flex>
            </Flex>
            <Box maxHeight="630px" overflowY="auto">
                {children}
            </Box>
            <Flex
                borderTop="1px solid"
                borderTopColor="basic.$1000"
                px="$40"
                py="$20"
            >
                <Button
                    flexGrow={1}
                    variant="danger"
                    variantSize="medium"
                    onClick={onReject}
                >
                    Reject
                </Button>
                <Button
                    ml="$20"
                    flexGrow={1}
                    variant="primary"
                    variantSize="medium"
                    onClick={onConfirm}
                >
                    Confirm
                </Button>
            </Flex>
        </Flex>
    );
};
