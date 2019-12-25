import {
    Flex,
    Icon,
    iconDataTransaction,
    Text,
} from '@waves.exchange/react-uikit';
import { IData } from '@waves/waves-js';
import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { DataEntry } from '../../components/DataEntry/DataEntry';

type SignDataComponentProps = {
    userAddress: string;
    userName: string;
    userBalance: string;
    data: IData['data'];
    fee: string;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
};

export const SignDataComponent: FC<SignDataComponentProps> = ({
    userAddress,
    userName,
    userBalance,
    data,
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
        <Flex px="$40" py="$30" bg="main.$900">
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

        <Flex
            px="$40"
            py="$30"
            flexDirection="column"
            bg="main.$800"
            borderTop="1px solid"
            borderTopColor="basic.$1000"
        >
            <Text variant="body2" color="basic.$500" mb="$5">
                Data
            </Text>
            <DataEntry data={data} />

            <Text variant="body2" color="basic.$500" mb="$5">
                Fee
            </Text>
            <Text variant="body2" color="standard.$0">
                {fee}
            </Text>
        </Flex>
    </Confirmation>
);
