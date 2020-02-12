import {
    AddressAvatar,
    Flex,
    Icon,
    iconLeaseTransaction,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
    AddressLabel,
} from '@waves.exchange/react-uikit';
import { TLong } from '@waves/signer';
import { ILeaseTransactionWithId } from '@waves/ts-types';
import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { DataJson } from '../../components/DataJson/DataJson';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';

type Props = {
    userAddress: string;
    userName: string;
    userBalance: string;
    recipientAddress: string;
    recipientName: string;
    tx: ILeaseTransactionWithId<TLong>;
    amount: string;
    fee: string;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
};

export const SignLeaseComponent: FC<Props> = ({
    recipientAddress,
    recipientName,
    userAddress,
    userBalance,
    userName,
    tx,
    amount,
    fee,
    onReject,
    onConfirm,
}) => (
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
                bg="rgba(129, 201, 38, 0.1)"
                height={60}
                width={60}
            >
                <Icon icon={iconLeaseTransaction} size={40} color="#81C926" />
            </Flex>
            <Flex ml="$20" flexDirection="column">
                <Text variant="body1" color="basic.$500">
                    Sign Lease TX
                </Text>
                <Text fontSize={26} lineHeight="32px" color="standard.$0">
                    {amount}
                </Text>
            </Flex>
        </Flex>

        <Tabs>
            <TabsList
                borderBottom="1px solid"
                borderColor="main.$700"
                bg="main.$900"
                mb="$30"
                px="$40"
            >
                <Tab mr="32px" pb="12px">
                    <Text variant="body1">Main</Text>
                </Tab>
                <Tab mr="32px" pb="12px">
                    <Text variant="body1">Details</Text>
                </Tab>
                <Tab mr="32px" pb="12px">
                    <Text variant="body1">JSON</Text>
                </Tab>
            </TabsList>

            <TabPanels bg="main.$800" mb="$30" px="$40">
                <TabPanel>
                    <Flex flexDirection="column">
                        <Text variant="body2" color="basic.$500">
                            Recipient
                        </Text>
                        <AddressLabel
                            address={recipientAddress}
                            alias={recipientName}
                            withCopy={true}
                            mt="$5"
                        >
                            <AddressAvatar address={recipientAddress} />
                        </AddressLabel>

                        <Text mt="$20" variant="body2" color="basic.$500">
                            Fee
                        </Text>
                        <Text
                            variant="body2"
                            color="standard.$0"
                            display="block"
                        >
                            {fee}
                        </Text>
                    </Flex>
                </TabPanel>
                <TabPanel>
                    <TransactionDetails tx={tx} />
                </TabPanel>
                <TabPanel>
                    <DataJson data={tx} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Confirmation>
);
