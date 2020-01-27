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
import { TLong } from '@waves/signer';
import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { DataEntry } from '../../components/DataEntry/DataEntry';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { IDataTransaction, IWithId } from '@waves/ts-types';
import { TransactionJson } from '../../components/TransactionJson/TransactionJson';

type SignDataComponentProps = {
    userAddress: string;
    userName: string;
    userBalance: string;
    tx: IDataTransaction<TLong> & IWithId;
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

        <Tabs px="$40">
            <TabsList borderBottom="1px solid" borderColor="main.$700" mb="$30">
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

            <Flex
                mb="$30"
                flexDirection="column"
                bg="main.$800"
                borderTop="1px solid"
                borderTopColor="basic.$1000"
            >
                <TabPanels>
                    <TabPanel>
                        <Text variant="body2" color="basic.$500" mb="$5">
                            Data
                        </Text>
                        <DataEntry data={tx.data} />
                        <Text variant="body2" color="basic.$500" mb="$5">
                            Fee
                        </Text>{' '}
                        <Text variant="body2" color="standard.$0">
                            {fee}
                        </Text>
                    </TabPanel>
                    <TabPanel>
                        <TransactionDetails tx={tx} />
                    </TabPanel>
                    <TabPanel>
                        <TransactionJson tx={tx} />
                    </TabPanel>
                </TabPanels>
            </Flex>
        </Tabs>
    </Confirmation>
);
