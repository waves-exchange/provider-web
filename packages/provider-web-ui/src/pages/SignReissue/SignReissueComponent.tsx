import {
    AssetLogoWithIcon,
    Box,
    Copy,
    Flex,
    Help,
    Icon,
    iconReissueTransaction,
    iconSmartMini,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
    useBoundedTooltip,
} from '@waves.exchange/react-uikit';
import { ReissueTransaction, WithId } from '@waves/ts-types';
import React, { FC, MouseEventHandler } from 'react';
import { DetailsWithLogo } from '../../interface';
import { Confirmation } from '../../components/Confirmation';
import { DataJson } from '../../components/DataJson/DataJson';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { WAVES } from '../../constants';

type SignReissueComponentProps = {
    userAddress: string;
    userName: string;
    userBalance: string;
    tx: ReissueTransaction & WithId;
    reissueAmount: string;
    reissueAsset: DetailsWithLogo | typeof WAVES;
    fee: string;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
};

export const SignReissueComponent: FC<SignReissueComponentProps> = ({
    userAddress,
    userName,
    userBalance,
    tx,
    reissueAmount,
    reissueAsset,
    fee,
    onConfirm,
    onReject,
}) => {
    const {
        boundaryRef: assetLogoWithIconTooltipBoundaryRef,
        popperOptions: assetLogoWithIconPopperOptions,
    } = useBoundedTooltip({ left: 0 });

    return (
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
                    bg="rgba(129, 201, 38, 0.1)"
                    height={60}
                    width={60}
                >
                    <Icon
                        icon={iconReissueTransaction}
                        size={40}
                        color="#81c926"
                    />
                </Flex>

                <Flex ml="$20" flexDirection="column">
                    <Text variant="body1" color="basic.$500">
                        Sign Reissue TX
                    </Text>
                    <Text fontSize={26} lineHeight="32px" color="standard.$0">
                        {reissueAmount}
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
                        <Box mb="$20" ref={assetLogoWithIconTooltipBoundaryRef}>
                            <Text
                                variant="body2"
                                color="basic.$500"
                                mb="$5"
                                display="block"
                            >
                                Asset ID
                            </Text>
                            <Flex alignItems="center">
                                <AssetLogoWithIcon
                                    assetId={reissueAsset.assetId}
                                    name={reissueAsset.name}
                                    size="30px"
                                    flexShrink={0}
                                    icon={iconSmartMini}
                                    iconVisible={reissueAsset.scripted}
                                    iconLabel="Smart asset"
                                    popperOptions={
                                        assetLogoWithIconPopperOptions
                                    }
                                />
                                <Copy
                                    text={reissueAsset.assetId}
                                    inititialTooltipLabel="Copy"
                                    copiedTooltipLabel="Copied!"
                                    ml="$10"
                                >
                                    <Text color="standard.$0" variant="body2">
                                        {reissueAsset.assetId}
                                    </Text>
                                </Copy>
                            </Flex>
                        </Box>

                        <Flex mb="$5">
                            <Text variant="body2" color="basic.$500" mr="$5">
                                Asset Type
                            </Text>
                            <Help align="left" direction="bottom">
                                <Box maxWidth="400px">
                                    <Text variant="body1" color="standard.$0">
                                        This field defines the total tokens
                                        supply that your asset will contain.
                                    </Text>
                                    <Text
                                        variant="body2"
                                        color="standard.$0"
                                        as="p"
                                    >
                                        Reissuability allows for additional
                                        tokens creation that will be added to
                                        the total token supply of asset.
                                    </Text>
                                    <Text
                                        variant="body2"
                                        color="standard.$0"
                                        as="p"
                                    >
                                        A non-reissuable asset will be
                                        permanently limited to the total token
                                        supply defined during these steps.
                                    </Text>
                                </Box>
                            </Help>
                        </Flex>
                        <Text
                            variant="body2"
                            color="standard.$0"
                            mb="$20"
                            display="block"
                        >
                            {tx.reissuable ? 'Reissuable' : 'Non-reissuable'}
                        </Text>

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
    );
};
