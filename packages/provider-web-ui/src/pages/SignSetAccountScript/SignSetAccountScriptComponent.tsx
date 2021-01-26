import {
    AddressAvatar,
    AddressLabel,
    Box,
    BoxWithIcon,
    ExternalLink,
    Flex,
    Icon,
    iconSetAssetScript,
    iconSmartMini,
    LightCopy,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
    useBoundedTooltip,
} from '@waves.exchange/react-uikit';
import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { DataJson } from '../../components/DataJson/DataJson';
import { Help } from '../../components/Help/Help';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { SetScriptTransaction, WithId } from '@waves/ts-types';

export interface IProps {
    userAddress: string;
    userName: string;
    userBalance: string;
    userHasScript: boolean;
    fee: string;
    tx: SetScriptTransaction & WithId;
    accountScript: string | null;
    onCancel: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
}

export const SignSetAccountScriptComponent: FC<IProps> = ({
    userAddress,
    userName,
    userBalance,
    userHasScript,
    tx,
    fee,
    accountScript,
    onCancel,
    onConfirm,
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
                onReject={onCancel}
                onConfirm={onConfirm}
            >
                <Flex px="$40" py="$20" bg="main.$900" alignItems="center">
                    <Flex
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="circle"
                        bg="rgba(129, 201, 38, 0.1)"
                        height={60}
                        width={60}
                        flexShrink={0}
                    >
                        <Icon
                            icon={iconSetAssetScript}
                            size={40}
                            color="#81C926"
                        />
                    </Flex>
                    <Flex ml="$20" flexDirection="column" overflowX="hidden">
                        <Text
                            fontSize={26}
                            lineHeight="32px"
                            color="standard.$0"
                        >
                            Sign Set Account Script TX
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
                                    Account
                                </Text>
                                <Flex
                                    alignItems="center"
                                    mt="$5"
                                    ref={boundaryRef}
                                >
                                    <AddressLabel
                                        address={userAddress}
                                        withCopy={true}
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
                                </Flex>
                                <Flex mt="$20" mb="$5" alignItems="center">
                                    <Text
                                        variant="body2"
                                        color="basic.$500"
                                        mr="3px"
                                    >
                                        Smart Account Script
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
                                        <Text
                                            display="block"
                                            variant="body1"
                                            fontWeight={700}
                                        >
                                            A smart account is an account that
                                            has an account script attached to
                                            it.
                                        </Text>
                                        <Text
                                            display="block"
                                            variant="body2"
                                            mt="5px"
                                        >
                                            If the transaction is sent from a
                                            smart account, the transaction fee
                                            is increased by 0.004 WAVES. So if
                                            the transaction fee is 0.001 WAVES,
                                            the owner of the smart account will
                                            pay 0.001 + 0.004 = 0.005 WAVES
                                            <ExternalLink
                                                mt="$5"
                                                variant="body2"
                                                display="block"
                                                href="https://docs.wavesplatform.com/en/building-apps/smart-contracts/what-is-smart-account#expression"
                                            >
                                                Learn more
                                            </ExternalLink>
                                        </Text>
                                    </Help>
                                </Flex>

                                <Flex
                                    bg="basic.$900"
                                    borderRadius="$4"
                                    py="15px"
                                    pl="15px"
                                    pr="5px"
                                    flexDirection="column"
                                    alignItems="flex-end"
                                >
                                    <Box
                                        width="100%"
                                        maxHeight="165px"
                                        overflow="auto"
                                        pr="10px"
                                    >
                                        <Text
                                            as="pre"
                                            variant="body2"
                                            color="standard.$0"
                                            m={0}
                                        >
                                            {accountScript}
                                        </Text>
                                    </Box>
                                    <LightCopy
                                        text={accountScript || ''}
                                        mr="15px"
                                        fontSize={13}
                                        color="primary.$300"
                                        lineHeight="18px"
                                        cursor="pointer"
                                    >
                                        Copy
                                    </LightCopy>
                                </Flex>
                                <Text
                                    variant="body2"
                                    color="basic.$500"
                                    mt="$20"
                                    display="block"
                                >
                                    Fee
                                </Text>
                                <Text
                                    variant="body2"
                                    color="standard.$0"
                                    display="block"
                                    mt="$5"
                                >
                                    {fee}
                                </Text>
                            </Flex>
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
