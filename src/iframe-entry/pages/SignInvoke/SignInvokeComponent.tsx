import {
    Box,
    Flex,
    Heading,
    Icon,
    iconInvoke,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
    Select,
    Selected,
    List,
    AddressAvatar,
} from '@waves.exchange/react-uikit';
import { ICall, TLong, IInvokeWithType } from '@waves/signer';
import { IInvokeScriptTransaction, IWithId } from '@waves/ts-types';
import React, { FC, MouseEventHandler, ReactElement } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { InvokeFunction } from '../../components/InvokeFunction/InvokeFunction';
import { InvokePayment } from '../../components/InvokePayment/InvokePayment';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { TransactionJson } from '../../components/TransactionJson/TransactionJson';
import { IPayment } from './SignInvokeContainer';
import { FeeOption } from '@waves.exchange/react-uikit';
import { IMeta } from '../../services/transactionsService';

export interface IProps {
    userAddress: string;
    userName: string;
    userBalance: string;
    dAppAddress: string;
    dAppName: string;
    fee: string;
    call?: ICall;
    chainId?: number;
    payment: Array<IPayment>;
    tx: IInvokeScriptTransaction<TLong> & IWithId;
    meta: IMeta<IInvokeWithType<TLong>>;
    feeList: FeeOption[];
    selectedFee: FeeOption;
    onFeeSelect: (option: FeeOption) => void;
    onCancel: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
}

export const SignInvoke: FC<IProps> = ({
    userAddress,
    userName,
    userBalance,
    dAppAddress,
    dAppName,
    meta,
    call,
    payment,
    tx,
    onCancel,
    onConfirm,
    feeList,
    selectedFee,
    onFeeSelect,
}) => (
    <Confirmation
        address={userAddress}
        name={userName}
        balance={userBalance}
        onReject={onCancel}
        onConfirm={onConfirm}
    >
        <Box bg="main.$800">
            <Flex
                py="$20"
                px="$40"
                mb="$20"
                bg="main.$900"
                borderBottom="1px solid"
                borderBottomColor="basic.$1000"
            >
                <Flex
                    borderRadius="circle"
                    width="60px"
                    height="60px"
                    bg="rgba(255, 175, 0, 0.1)"
                    justifyContent="center"
                    alignItems="center"
                    mr="$20"
                >
                    <Icon size="40px" icon={iconInvoke} color="#FFAF00" />
                </Flex>
                {payment && (
                    <Flex justifyContent="center" flexDirection="column">
                        <Text variant="body1" color="basic.$500" mb="$3">
                            Sign Invoke Script TX
                        </Text>
                        <Heading variant="heading2" color="standard.$0">
                            {payment.length > 0 ? payment.length : 'No'}{' '}
                            Payments
                        </Heading>
                    </Flex>
                )}
            </Flex>

            <Tabs px="$40">
                <TabsList
                    borderBottom="1px solid"
                    borderColor="main.$700"
                    mb="$30"
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

                <Flex
                    mb="$30"
                    flexDirection="column"
                    bg="main.$800"
                    borderTop="1px solid"
                    borderTopColor="basic.$1000"
                >
                    <TabPanels>
                        <TabPanel>
                            <Box mb="$20">
                                <Text
                                    variant="body2"
                                    color="basic.$500"
                                    as="div"
                                >
                                    Account
                                </Text>
                                <AddressAvatar
                                    address={dAppAddress}
                                    alias={dAppName}
                                    addressWithCopy={true}
                                    mt="$5"
                                />
                            </Box>

                            {payment && payment.length > 0 && (
                                <Box mb="$20">
                                    <Text
                                        variant="body2"
                                        color="basic.$500"
                                        as="div"
                                        mb="$5"
                                    >
                                        Payments
                                    </Text>
                                    <Box
                                        p="$5"
                                        bg="basic.$900"
                                        borderRadius="$4"
                                    >
                                        <Flex
                                            flexDirection="column"
                                            borderRadius="$4"
                                            bg="basic.$900"
                                            px="$5"
                                            maxHeight="165px"
                                            overflowY="auto"
                                        >
                                            {payment.map((pay, i) => (
                                                <InvokePayment
                                                    key={pay.assetId || 'WAVES'}
                                                    {...pay}
                                                    isLast={
                                                        i === payment.length - 1
                                                    }
                                                />
                                            ))}
                                        </Flex>
                                    </Box>
                                </Box>
                            )}

                            <Box mb="$20">
                                <Text
                                    variant="body2"
                                    color="basic.$500"
                                    as="div"
                                    mb="$5"
                                >
                                    Call function
                                </Text>
                                <InvokeFunction
                                    borderRadius="$4"
                                    bg="basic.$900"
                                    p="15px"
                                    color="basic.$500"
                                    as="div"
                                    overflowX="auto"
                                    args={call?.args ?? ([] as any)}
                                    name={call?.function ?? 'default'}
                                />
                            </Box>

                            <Box>
                                <Text
                                    variant="body2"
                                    color="basic.$500"
                                    as="div"
                                >
                                    Fee
                                </Text>
                                <Select
                                    isDisabled={meta.feeList.length === 0}
                                    placement="top"
                                    renderSelected={(open): ReactElement => (
                                        <Selected
                                            selected={selectedFee}
                                            opened={open}
                                        />
                                    )}
                                >
                                    <List
                                        onSelect={onFeeSelect}
                                        options={feeList}
                                        css={{ bottom: 56 }}
                                    ></List>
                                </Select>
                            </Box>
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
        </Box>
    </Confirmation>
);
