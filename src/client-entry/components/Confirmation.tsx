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
    onSubmit: MouseEventHandler<HTMLButtonElement>;
};

export const Confirmation: FC<IConfirmationProps> = ({
    address,
    name,
    balance,
    children,
    onReject,
    onSubmit,
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
            <Flex justifyContent="space-between" px="$40" py="15px">
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
            <Box maxHeight="432px" overflowY="auto">
                {children}
            </Box>
            <Flex
                justifyContent="space-between"
                borderTopColor="basic.$1000"
                borderTopWidth="1px"
                borderTopStyle="solid"
                px="$40"
                py="$20"
            >
                <Button
                    variant="danger"
                    variantSize="large"
                    width="210px"
                    onClick={onReject}
                >
                    Reject
                </Button>
                <Button
                    variant="primary"
                    variantSize="large"
                    width="210px"
                    onClick={onSubmit}
                >
                    Confirm
                </Button>
            </Flex>
        </Flex>
    );
};
