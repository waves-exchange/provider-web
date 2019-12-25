import React, { FC, MouseEventHandler } from 'react';

import { Text, Flex, AddressAvatar } from '@waves.exchange/react-uikit';
import {
    IconTransfer,
    IconTransferType,
} from '../../components/IconTransfer/IconTransfer';
import { Confirmation } from '../../components/Confirmation';

interface Props {
    userAddress: string;
    userName: string;
    userBalance: string;
    transferAmount: string;
    attachement: string;
    transferFee: string;
    recipientAddress: string;
    iconType: IconTransferType;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
}

export const SignTransfer: FC<Props> = ({
    recipientAddress,
    userAddress,
    userBalance,
    userName,
    attachement,
    transferAmount,
    transferFee,
    iconType,
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
            <Flex px="$40" py="$30" bg="main.$900">
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="circle"
                    bg="rgba(255, 175, 0, 0.1)"
                    height={60}
                    width={60}
                >
                    <IconTransfer type={iconType} size={40} />
                </Flex>
                <Flex ml="$20" flexDirection="column">
                    <Text variant="body1" color="basic.$500">
                        Sign Transfer TX
                    </Text>
                    <Text fontSize={26} lineHeight="32px" color="standard.$0">
                        {transferAmount}
                    </Text>
                </Flex>
            </Flex>

            <Flex px="$40" py="$30" flexDirection="column" bg="main.$800">
                <Text variant="body2" color="basic.$500">
                    Recipient
                </Text>
                <AddressAvatar
                    mt="$5"
                    address={recipientAddress}
                    addressWithCopy={true}
                />

                {attachement ? (
                    <>
                        <Text mt="$20" variant="body2" color="basic.$500">
                            Attachment
                        </Text>

                        <Text
                            mt="$5"
                            p="15px"
                            variant="body2"
                            color="standard.$0"
                            bg="basic.$900"
                        >
                            {attachement}
                        </Text>
                    </>
                ) : null}

                <Text mt="$20" variant="body2" color="basic.$500">
                    Fee
                </Text>
                <Text mt="$5" variant="body2" color="standard.$0">
                    {transferFee}
                </Text>
            </Flex>
        </Confirmation>
    );
};
