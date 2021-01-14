import {
    Copy,
    Flex,
    Icon,
    iconCancelLeaseTransaction,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
} from '@waves.exchange/react-uikit';
import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { DataJson } from '../../components/DataJson/DataJson';
import { CancelLeaseTransaction, WithId } from '@waves/ts-types';

type Props = {
    userAddress: string;
    userName: string;
    userBalance: string;
    amount: string;
    tx: CancelLeaseTransaction & WithId;
    fee: string;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
};

export const SignCancelLeaseComponent: FC<Props> = ({
    userAddress,
    userBalance,
    userName,
    amount,
    tx,
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
                bg="rgba(239, 72, 41, 0.1)"
                height={60}
                width={60}
            >
                <Icon
                    icon={iconCancelLeaseTransaction}
                    size={40}
                    color="#ef4829"
                />
            </Flex>
            <Flex ml="$20" flexDirection="column">
                <Text variant="body1" color="basic.$500">
                    Sign Lease Cancel TX
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
                    <Text mt="$20" variant="body2" color="basic.$500">
                        Lease ID
                    </Text>

                    <Copy
                        inititialTooltipLabel="Copy Lease ID"
                        copiedTooltipLabel="Copied!"
                        text={tx.leaseId}
                        mb="$20"
                    >
                        <Text
                            variant="body2"
                            color="standard.$0"
                            display="block"
                        >
                            {tx.leaseId}
                        </Text>
                    </Copy>

                    <Text mt="$20" variant="body2" color="basic.$500">
                        Fee
                    </Text>
                    <Text variant="body2" color="standard.$0" display="block">
                        {fee}
                    </Text>
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
