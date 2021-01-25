import {
    AddressAvatar,
    AddressLabel,
    Box,
    BoxWithIcon,
    Flex,
    Heading,
    Icon,
    iconInvoke,
    iconSmartMini,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
    useBoundedTooltip,
} from '@waves.exchange/react-uikit';
import {
    InvokeScriptCall,
    InvokeScriptTransaction,
    Long,
    WithId,
} from '@waves/ts-types';
import React, { FC, MouseEventHandler } from 'react';
import { IMeta } from '../../../interface';
import { Confirmation } from '../../components/Confirmation';
import { DataJson } from '../../components/DataJson/DataJson';
import {
    FeeSelect,
    FeeSelectHandler,
} from '../../components/FeeSelect/FeeSelect';
import { InvokeFunction } from '../../components/InvokeFunction/InvokeFunction';
import { InvokePayment } from '../../components/InvokePayment/InvokePayment';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { WAVES } from '../../constants';
import { getPrintableNumber } from '../../utils/math';
import { IPayment } from './SignInvokeContainer';

export interface IProps {
    userAddress: string;
    userName: string;
    userBalance: Long;
    dAppAddress: string;
    dAppName: string;
    fee: string;
    call?: InvokeScriptCall<Long>;
    chainId?: number;
    payment: Array<IPayment>;
    tx: InvokeScriptTransaction<Long> & WithId;
    meta: IMeta<InvokeScriptTransaction>;
    onCancel: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
    handleFeeSelect: FeeSelectHandler;
    txJSON: string;
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
    handleFeeSelect,
    txJSON,
}) => {
    const { boundaryRef, popperOptions } = useBoundedTooltip({});

    return (
        <Confirmation
            address={userAddress}
            name={userName}
            balance={`${getPrintableNumber(userBalance, WAVES.decimals)} Waves`}
            onReject={onCancel}
            onConfirm={onConfirm}
        >
            <Flex py="$20" px="$40" bg="main.$900">
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
                        <Box mb="$20" ref={boundaryRef}>
                            <Text
                                variant="body2"
                                color="basic.$500"
                                mb="$3"
                                as="div"
                            >
                                dApp
                            </Text>
                            <AddressLabel
                                address={dAppAddress}
                                alias={dAppName}
                                withCopy={true}
                                mt="$5"
                            >
                                <BoxWithIcon
                                    icon={iconSmartMini}
                                    iconLabel="Script account"
                                    popperOptions={popperOptions}
                                >
                                    <AddressAvatar address={dAppAddress} />
                                </BoxWithIcon>
                            </AddressLabel>
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
                                <Box p="$5" bg="basic.$900" borderRadius="$4">
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
                                args={call?.args ?? []}
                                name={call?.function ?? 'default'}
                            />
                        </Box>

                        <FeeSelect
                            mt="$20"
                            txMeta={meta}
                            fee={tx.fee}
                            onFeeSelect={handleFeeSelect}
                            availableWavesBalance={userBalance}
                        />
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
};
