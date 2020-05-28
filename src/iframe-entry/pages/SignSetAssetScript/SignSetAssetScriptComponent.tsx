import {
    Flex,
    Icon,
    iconSetAssetScript,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
    Copy,
    ExternalLink,
    useBoundedTooltip,
    AssetLogoWithIcon,
    iconSmartMini,
} from '@waves.exchange/react-uikit';
import { TLong } from '@waves/signer';
import { ISetAssetScriptTransactionWithId } from '@waves/ts-types';
import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { DataJson } from '../../components/DataJson/DataJson';
import { Help } from '../../components/Help/Help';

export interface IProps {
    userAddress: string;
    userName: string;
    userBalance: string;
    fee: string;
    tx: ISetAssetScriptTransactionWithId<TLong>;
    onCancel: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
    assetId: string;
    assetName: string;
    assetScript: string;
}

export const SignSetAssetScript: FC<IProps> = ({
    userAddress,
    userName,
    userBalance,
    tx,
    fee,
    onCancel,
    onConfirm,
    assetId,
    assetName,
    assetScript,
}) => {
    const {
        boundaryRef: helpTooltipBoundaryRef,
        popperOptions: helpTooltipPopperOptions,
    } = useBoundedTooltip({
        left: 60,
        right: 60,
    });

    const {
        boundaryRef: smartAssetLogoTooltipBoundaryRef,
        popperOptions: smartAssetLogoPopperOptions,
    } = useBoundedTooltip({ left: 0 });

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
                            Sign Set Asset Script TX
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
                            <Flex
                                flexDirection="column"
                                bg="main.$800"
                                ref={smartAssetLogoTooltipBoundaryRef}
                            >
                                <Text variant="body2" color="basic.$500">
                                    Asset ID
                                </Text>
                                <Flex alignItems="center" mt="$5">
                                    <AssetLogoWithIcon
                                        icon={iconSmartMini}
                                        iconLabel="Smart asset"
                                        iconVisible={Boolean(assetScript)}
                                        assetId={assetId}
                                        name={assetName}
                                        size="30px"
                                        flexShrink={0}
                                        popperOptions={{
                                            strategy: 'fixed',
                                            ...smartAssetLogoPopperOptions,
                                        }}
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
                                <Flex mt="$20" alignItems="center">
                                    <Text
                                        variant="body2"
                                        color="basic.$500"
                                        mr="3px"
                                    >
                                        Smart Asset Script
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
                                            A Smart Asset is an asset with an
                                            attached script that places
                                            conditions on every transaction made
                                            for the token in question.
                                        </Text>
                                        <Text
                                            display="block"
                                            variant="body2"
                                            mt="5px"
                                        >
                                            Each validation of a transaction by
                                            a Smart Asset's script increases the
                                            transaction fee by 0.004 WAVES. For
                                            example, if a regular tx is made for
                                            a Smart Asset, the cost is 0.001 +
                                            0.004 = 0.005 WAVES. If an exchange
                                            transaction is made, the cost is
                                            0.003 + 0.004 = 0.007 WAVES.
                                            <ExternalLink
                                                mt="$5"
                                                variant="body2"
                                                display="block"
                                                href="https://docs.wavesplatform.com/en/building-apps/smart-contracts/smart-assets"
                                            >
                                                Learn more
                                            </ExternalLink>
                                        </Text>
                                    </Help>
                                </Flex>

                                <Text
                                    display="block"
                                    mt="$5"
                                    p="15px"
                                    variant="body2"
                                    color="standard.$0"
                                    bg="basic.$900"
                                    borderRadius="$4"
                                    maxHeight="185px"
                                    overflowY="auto"
                                >
                                    {assetScript}
                                </Text>
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
