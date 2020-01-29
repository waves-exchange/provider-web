import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { ITypedData } from '@waves/signer';
import {
    Flex,
    Icon,
    iconSignMessage,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
} from '@waves.exchange/react-uikit';
import { DataEntry } from '../../components/DataEntry/DataEntry';
import { DataJson } from '../../components/DataJson/DataJson';

type SignTypedDataComponentProps = {
    userAddress: string;
    userName: string;
    userBalance: string;
    data: Array<ITypedData>;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
};

export const SignTypedDataComponent: FC<SignTypedDataComponentProps> = ({
    userAddress,
    userName,
    userBalance,
    data,
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
                bg="rgba(255, 175, 0, 0.1)"
                height={60}
                width={60}
            >
                <Icon size="60px" icon={iconSignMessage} color="primary.$300" />
            </Flex>
            <Flex ml="$20" flexDirection="column">
                <Text variant="body1" color="basic.$500">
                    Off-chain
                </Text>
                <Text fontSize={26} lineHeight="32px" color="standard.$0">
                    Sign Data
                </Text>
            </Flex>
        </Flex>

        <Tabs>
            <TabsList
                borderBottom="1px solid"
                borderColor="main.$700"
                mb="$30"
                px="$40"
                bg="main.$900"
            >
                <Tab mr="32px" pb="12px">
                    <Text variant="body1">Data</Text>
                </Tab>
                <Tab mr="32px" pb="12px">
                    <Text variant="body1">JSON</Text>
                </Tab>
            </TabsList>

            <TabPanels mb="$30" px="$40" bg="main.$800">
                <TabPanel>
                    <DataEntry data={data} />
                </TabPanel>
                <TabPanel>
                    <DataJson data={data} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Confirmation>
);
