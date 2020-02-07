import {
    Flex,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
    AddressAvatar,
} from '@waves.exchange/react-uikit';
import { ITransferWithType, TLong } from '@waves/signer';
import { ITransferTransaction, IWithId } from '@waves/ts-types';
import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import {
    IconTransfer,
    IconTransferType,
} from '../../components/IconTransfer/IconTransfer';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { IMeta } from '../../services/transactionsService';
import {
    FeeSelect,
    FeeSelectHandler,
} from '../../components/FeeSelect/FeeSelect';
import { getPrintableNumber } from '../../utils/math';
import { WAVES } from '../../constants';
import { DataJson } from '../../components/DataJson/DataJson';

type Props = {
    userAddress: string;
    userName: string;
    userBalance: TLong;
    transferAmount: string;
    attachement: string;
    transferFee: string;
    recipientAddress: string;
    recipientName: string;
    iconType: IconTransferType;
    tx: ITransferTransaction<TLong> & IWithId;
    meta: IMeta<ITransferWithType<TLong>>;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
    handleFeeSelect: FeeSelectHandler;
    txJSON: string;
};

export const SignTransfer: FC<Props> = ({
    recipientAddress,
    recipientName,
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
                    Sign Transfer TX
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
                    <Flex flexDirection="column">
                        <Text variant="body2" color="basic.$500">
                            Recipient
                        </Text>
                        <AddressAvatar
                            address={recipientAddress}
                            alias={recipientName}
                            addressWithCopy={true}
                            mt="$5"
                        />

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

                        <FeeSelect
                            mt="$20"
                            txMeta={meta}
                            fee={tx.fee}
                            onFeeSelect={handleFeeSelect}
                            availableWavesBalance={userBalance}
                        />
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
