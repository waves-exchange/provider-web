import {
    Flex,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
    AddressAvatar,
    Box,
} from '@waves.exchange/react-uikit';
import { TLong, ITransferWithType } from '@waves/signer';
import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import {
    IconTransfer,
    IconTransferType,
} from '../../components/IconTransfer/IconTransfer';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import {
    FeeSelect,
    FeeSelectHandler,
} from '../../components/FeeSelect/FeeSelect';
import { getPrintableNumber } from '../../utils/math';
import { WAVES } from '../../constants';
import { DataJson } from '../../components/DataJson/DataJson';
import { TransferTx } from './SignTransferContainer';
import { IMeta } from '../../services/transactionsService';
import { borderStyle } from 'styled-system';

type TransferListItem = {
    name: string;
    address: string;
    amount: string;
};
type Props = {
    userAddress: string;
    userName: string;
    userBalance: TLong;
    transferAmount: string;
    attachement: string;
    transferFee: string;
    tx: TransferTx;
    meta?: IMeta<ITransferWithType>;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
    handleFeeSelect: FeeSelectHandler;
    txJSON: string;
    iconType: IconTransferType;
    isMassTransfer: boolean;
    transferList: TransferListItem[];
};

export const SignTransfer: FC<Props> = ({
    userAddress,
    userBalance,
    userName,
    attachement,
    transferAmount,
    iconType,
    tx,
    meta,
    onReject,
    onConfirm,
    handleFeeSelect,
    txJSON,
    transferList,
    transferFee,
    isMassTransfer,
}) => (
    <Confirmation
        address={userAddress}
        name={userName}
        balance={`${getPrintableNumber(userBalance, WAVES.decimals)} Waves`}
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
                <IconTransfer type={iconType} size={40} />
            </Flex>
            <Flex ml="$20" flexDirection="column">
                <Text variant="body1" color="basic.$500">
                    {!isMassTransfer
                        ? 'Sign Transfer TX'
                        : 'Sign MassTransfer TX'}
                </Text>
                <Text fontSize={26} lineHeight="32px" color="standard.$0">
                    {transferAmount}
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
                    <Flex flexDirection="column" bg="main.$800">
                        <Text variant="body2" color="basic.$500">
                            {!isMassTransfer ? 'Recipient' : 'Recipients'}
                        </Text>
                        {!isMassTransfer ? (
                            <AddressAvatar
                                address={transferList[0].address}
                                alias={transferList[0].name}
                                addressWithCopy={true}
                                mt="$5"
                            />
                        ) : (
                            <Box
                                sx={{
                                    '& > * + *': {
                                        borderTop: '1px dashed',
                                        borderColor: 'main.$500',
                                    },
                                }}
                                mt="$5"
                                p={15}
                                backgroundColor="basic.$900"
                                borderRadius="$4"
                                maxHeight={240}
                                overflowY="auto"
                            >
                                {transferList.map(({ address, amount }, i) => (
                                    <Flex
                                        key={i}
                                        alignItems="center"
                                        justifyContent="space-between"
                                        pt={i > 0 ? '7px' : 0}
                                        pb={
                                            i < transferList.length - 1
                                                ? '7px'
                                                : 0
                                        }
                                    >
                                        <AddressAvatar address={address} />
                                        <Text
                                            variant="body2"
                                            color="standard.$0"
                                        >
                                            {amount}
                                        </Text>
                                    </Flex>
                                ))}
                            </Box>
                        )}

                        {attachement ? (
                            <>
                                <Text
                                    mt="$20"
                                    variant="body2"
                                    color="basic.$500"
                                >
                                    Attachment
                                </Text>

                                <Text
                                    mt="$5"
                                    p="15px"
                                    variant="body2"
                                    color="standard.$0"
                                    bg="basic.$900"
                                    borderRadius="$4"
                                >
                                    {attachement}
                                </Text>
                            </>
                        ) : null}

                        {isMassTransfer && (
                            <>
                                <Text
                                    variant="body2"
                                    color="basic.$500"
                                    display="block"
                                    mt="$20"
                                    mb="$5"
                                >
                                    Fee
                                </Text>
                                <Text variant="body2" color="standard.$0">
                                    {transferFee}
                                </Text>
                            </>
                        )}

                        {meta && !isMassTransfer && (
                            <FeeSelect
                                mt="$20"
                                txMeta={meta}
                                fee={tx.fee}
                                onFeeSelect={handleFeeSelect}
                                availableWavesBalance={userBalance}
                            />
                        )}
                    </Flex>
                </TabPanel>
                <TabPanel>
                    <TransactionDetails tx={tx} />
                </TabPanel>
                <TabPanel>
                    <DataJson data={txJSON} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    </Confirmation>
);
