import {
    Flex,
    Icon,
    iconDataTransaction,
    Text,
    Tabs,
    TabsList,
    Tab,
    TabPanels,
    TabPanel,
} from '@waves.exchange/react-uikit';
import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { DataEntry } from '../../components/DataEntry/DataEntry';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { DataJson } from '../../components/DataJson/DataJson';
import { WithId, DataTransaction } from '@waves/ts-types';

type SignDataComponentProps = {
    userAddress: string;
    userName: string;
    userBalance: string;
    tx: DataTransaction & WithId;
    fee: string;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
};

export const SignDataComponent: FC<SignDataComponentProps> = ({
    userAddress,
    userName,
    userBalance,
    tx,
    fee,
    onConfirm,
    onReject,
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
                bg="rgba(90, 129, 234, 0.1)"
                height={60}
                width={60}
            >
                <Icon
                    icon={iconDataTransaction}
                    size={40}
                    color="primary.$300"
                />
            </Flex>

            <Flex ml="$20" flexDirection="column">
                <Text variant="body1" color="basic.$500">
                    On-chain
                </Text>
                <Text fontSize={26} lineHeight="32px" color="standard.$0">
                    Sign Data TX
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
                    <Text
                        variant="body2"
                        color="basic.$500"
                        display="block"
                        mb="$5"
                    >
                        Data
                    </Text>
                    <DataEntry data={tx.data} />
                    <Text
                        variant="body2"
                        color="basic.$500"
                        mb="$5"
                        display="block"
                    >
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
