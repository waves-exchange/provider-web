import {
    Flex,
    Icon,
    iconBurnTransaction,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
    Copy,
    AssetLogoWithIcon,
    useBoundedTooltip,
    iconSmartMini,
} from '@waves.exchange/react-uikit';
import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { DataJson } from '../../components/DataJson/DataJson';
import { WithId, BurnTransaction } from '@waves/ts-types';

export interface IProps {
    userAddress: string;
    userName: string;
    userBalance: string;
    fee: string;
    tx: BurnTransaction & WithId;
    onCancel: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
    burnAmount: string;
    assetId: string;
    assetName: string;
    isSmartAsset: boolean;
}

export const SignBurn: FC<IProps> = ({
    userAddress,
    userName,
    userBalance,
    tx,
    fee,
    onCancel,
    onConfirm,
    burnAmount,
    assetId,
    assetName,
    isSmartAsset,
}) => {
    const { boundaryRef, popperOptions } = useBoundedTooltip({ left: 40 });

    return (
        <div ref={boundaryRef}>
            <Confirmation
                address={userAddress}
                name={userName}
                balance={userBalance}
                onReject={onCancel}
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
                        flexShrink={0}
                    >
                        <Icon
                            icon={iconBurnTransaction}
                            size={40}
                            color="#FFAF00"
                        />
                    </Flex>
                    <Flex ml="$20" flexDirection="column" overflowX="hidden">
                        <Text variant="body1" color="basic.$500">
                            Sign Burn TX
                        </Text>
                        <Text
                            fontSize={26}
                            lineHeight="32px"
                            color="standard.$0"
                            isTruncated={true}
                        >
                            {burnAmount}
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
                                    Asset ID
                                </Text>
                                <Flex alignItems="center" mt="$5">
                                    <AssetLogoWithIcon
                                        icon={iconSmartMini}
                                        iconLabel="Smart asset"
                                        iconVisible={isSmartAsset}
                                        assetId={assetId}
                                        name={assetName}
                                        size={30}
                                        flexShrink={0}
                                        popperOptions={popperOptions}
                                    />
                                    <Copy
                                        ml="$10"
                                        inititialTooltipLabel={'Copy Asset ID'}
                                        copiedTooltipLabel={'Copied!'}
                                        text={assetId}
                                    >
                                        <Text
                                            variant="body2"
                                            color="standard.$0"
                                            isTruncated={true}
                                        >
                                            {assetId}
                                        </Text>
                                    </Copy>
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
