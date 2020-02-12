import {
    AddressAvatar,
    Box,
    Flex,
    Icon,
    iconAliasTransaction,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
    useBoundedTooltip,
    AddressLabel,
    BoxWithIcon,
    iconSmartMini,
} from '@waves.exchange/react-uikit';
import { TLong } from '@waves/signer';
import { IAliasTransactionWithId } from '@waves/ts-types';
import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { DataJson } from '../../components/DataJson/DataJson';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { Help } from '../../components/Help/Help';

type SignAliasComponentProps = {
    userAddress: string;
    userName: string;
    userBalance: string;
    userHasScript: boolean;
    tx: IAliasTransactionWithId<TLong>;
    fee: string;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
};

export const SignAliasComponent: FC<SignAliasComponentProps> = ({
    userAddress,
    userName,
    userBalance,
    userHasScript,
    tx,
    fee,
    onConfirm,
    onReject,
}) => {
    const {
        boundaryRef: helpTooltipBoundaryRef,
        popperOptions: helpTooltipPopperOptions,
    } = useBoundedTooltip({
        left: 60,
        right: 60,
    });

    const { boundaryRef, popperOptions } = useBoundedTooltip({});

    return (
        <div ref={helpTooltipBoundaryRef}>
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
                        bg="rgba(90, 174, 249, 0.1)"
                        height={60}
                        width={60}
                    >
                        <Icon
                            icon={iconAliasTransaction}
                            size={40}
                            color="#00aef9"
                        />
                    </Flex>

                    <Flex
                        ml="$20"
                        flexDirection="column"
                        justifyContent="center"
                    >
                        <Text
                            fontSize={26}
                            lineHeight="32px"
                            color="standard.$0"
                        >
                            Sign Alias TX
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
                        <TabPanel ref={boundaryRef}>
                            <Flex mb="$5">
                                <Text
                                    variant="body2"
                                    color="basic.$500"
                                    mr="$5"
                                >
                                    Alias
                                </Text>
                                <Help
                                    showDelay={1500}
                                    popperOptions={{
                                        strategy: 'fixed',
                                        ...helpTooltipPopperOptions,
                                        modifiers: [
                                            {
                                                name: 'flip',
                                                enabled: false,
                                            },
                                            ...((helpTooltipPopperOptions &&
                                                helpTooltipPopperOptions[
                                                    'modifiers'
                                                ]) ||
                                                []),
                                        ],
                                    }}
                                >
                                    <Box maxWidth="400px">
                                        <Text
                                            variant="body1"
                                            color="standard.$0"
                                        >
                                            About Alias
                                        </Text>
                                        <Text
                                            variant="body2"
                                            color="standard.$0"
                                            as="p"
                                        >
                                            An Alias is a nickname for your
                                            address. You can use an Alias
                                            instead of an address to make
                                            transactions.
                                        </Text>
                                        <Text
                                            variant="body2"
                                            color="standard.$0"
                                            as="p"
                                        >
                                            Your Alias must be between 4 and 30
                                            characters long and must contain
                                            only lowercase Latin letters, digits
                                            and symbols (@, -, _) and dot.
                                        </Text>
                                    </Box>
                                </Help>
                            </Flex>

                            <AddressLabel
                                address={userAddress}
                                alias={tx.alias}
                                withCopy={true}
                                mb="$20"
                            >
                                {userHasScript ? (
                                    <BoxWithIcon
                                        icon={iconSmartMini}
                                        iconLabel="Smart Account"
                                        popperOptions={popperOptions}
                                    >
                                        <AddressAvatar
                                            address={userAddress}
                                            variantSize="large"
                                        />
                                    </BoxWithIcon>
                                ) : (
                                    <AddressAvatar
                                        address={userAddress}
                                        variantSize="large"
                                    />
                                )}
                            </AddressLabel>

                            <Text
                                variant="body2"
                                color="basic.$500"
                                mb="$5"
                                display="block"
                            >
                                Fee
                            </Text>
                            <Text
                                variant="body2"
                                color="standard.$0"
                                display="block"
                            >
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
        </div>
    );
};
