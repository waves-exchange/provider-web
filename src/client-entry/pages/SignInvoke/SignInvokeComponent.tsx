import React, { FC, MouseEventHandler } from 'react';
import {
    AddressAvatar,
    Icon,
    Flex,
    Text,
    Heading,
    Box,
    iconInvoke,
} from '@waves.exchange/react-uikit';
import { Confirmation } from '../../components/Confirmation';
import { ICall } from '@waves/waves-js';
import { IPayment } from './SignInvokeContainer';
import { InvokePayment } from '../../components/InvokePayment/InvokePayment';
import { InvokeFunction } from '../../components/InvokeFunction/InvokeFunction';

export interface IProps {
    userAddress: string;
    userName: string;
    userBalance: string;
    dApp: string;
    fee: string;
    call?: ICall;
    chainId?: number;
    payment: Array<IPayment>;
    onCancel: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
}

export const SignInvoke: FC<IProps> = ({
    userAddress,
    userName,
    userBalance,
    dApp,
    fee,
    call,
    payment,
    onCancel,
    onConfirm,
}) => {
    return (
        <Confirmation
            address={userAddress}
            name={userName}
            balance={userBalance}
            onReject={onCancel}
            onConfirm={onConfirm}
        >
            <Box bg="main.$800">
                <Flex py="$20" px="$40" mb="$20" bg="main.$900">
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
                <Box px="$40">
                    <Box mb="$20">
                        <Text
                            variant="body2"
                            color="basic.$500"
                            mb="$3"
                            as="div"
                        >
                            Account
                        </Text>
                        <AddressAvatar address={dApp} addressWithCopy={true} />
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
                            <Flex
                                flexDirection="column"
                                borderRadius="$4"
                                bg="basic.$900"
                                px="$10"
                                py="$5"
                                maxHeight="165px"
                                overflowY="auto"
                            >
                                {payment.map((pay, i) => (
                                    <InvokePayment
                                        key={pay.assetId || 'WAVES'}
                                        {...pay}
                                        isLast={i === payment.length - 1}
                                    />
                                ))}
                            </Flex>
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
                        <Text
                            borderRadius="$4"
                            bg="basic.$900"
                            p="15px"
                            color="basic.$500"
                            as="div"
                            overflowX="auto"
                        >
                            <InvokeFunction
                                args={call?.args ?? ([] as any)}
                                name={call?.function ?? 'default'}
                            />
                        </Text>
                    </Box>

                    <Box mb="$30">
                        <Text variant="body2" color="basic.$500" as="div">
                            Fee
                        </Text>
                        <Text variant="body2" color="standard.$0">
                            {fee}
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Confirmation>
    );
};
