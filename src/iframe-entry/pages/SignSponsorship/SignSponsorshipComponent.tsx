import {
    AssetLogoWithIcon,
    Copy,
    Flex,
    Icon,
    iconSponsorshipDisableTransaction,
    iconSponsorshipEnableTransaction,
    iconSponsorshipMini,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
    useBoundedTooltip,
} from '@waves.exchange/react-uikit';
import { TLong } from '@waves/signer';
import { ISponsorshipTransaction, IWithId } from '@waves/ts-types';
import React, { FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { DataJson } from '../../components/DataJson/DataJson';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';
import { WAVES } from '../../constants';
import { DetailsWithLogo } from '../../utils/loadLogoInfo';
import { getPrintableNumber } from '../../utils/math';

type Props = {
    userAddress: string;
    userName: string;
    userBalance: TLong;
    tx: ISponsorshipTransaction<TLong> & IWithId;
    fee: string;
    sponsorAsset: DetailsWithLogo;
    sponsorCharge: string;
    isSponsorshipEnable: boolean;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
};

export const SignSponsorshipComponent: FC<Props> = ({
    userAddress,
    userBalance,
    userName,
    tx,
    fee,
    sponsorAsset,
    sponsorCharge,
    isSponsorshipEnable,
    onReject,
    onConfirm,
}) => {
    const { boundaryRef, popperOptions } = useBoundedTooltip({ left: 40 });

    return (
        <div ref={boundaryRef}>
            <Confirmation
                address={userAddress}
                name={userName}
                balance={`${getPrintableNumber(
                    userBalance,
                    WAVES.decimals
                )} Waves`}
                onReject={onReject}
                onConfirm={onConfirm}
            >
                <Flex px="$40" py="$20" bg="main.$900">
                    {isSponsorshipEnable ? (
                        <>
                            <Flex
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="circle"
                                bg="rgba(129, 201, 38, 0.1)"
                                height={60}
                                width={60}
                            >
                                <Icon
                                    icon={iconSponsorshipEnableTransaction}
                                    size={40}
                                    color="#81c926"
                                />
                            </Flex>
                            <Flex ml="$20" alignItems="center">
                                <Text
                                    fontSize="26px"
                                    lineHeight="32px"
                                    color="standard.$0"
                                >
                                    Sign Enable Sponsorship TX
                                </Text>
                            </Flex>
                        </>
                    ) : (
                        <>
                            <Flex
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="circle"
                                bg="rgba(248, 183, 0, 0.1)"
                                height={60}
                                width={60}
                            >
                                <Icon
                                    icon={iconSponsorshipDisableTransaction}
                                    size={40}
                                    color="warning.$500"
                                />
                            </Flex>
                            <Flex ml="$20" alignItems="center">
                                <Text
                                    fontSize="26px"
                                    lineHeight="32px"
                                    color="standard.$0"
                                >
                                    Sign Disable Sponsorship TX
                                </Text>
                            </Flex>
                        </>
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
                            <Flex flexDirection="column">
                                <Text
                                    variant="body2"
                                    color="basic.$500"
                                    mb="$5"
                                >
                                    Asset Id
                                </Text>

                                <Flex alignItems="center" mb="$20">
                                    <AssetLogoWithIcon
                                        assetId={sponsorAsset.assetId}
                                        name={sponsorAsset.name}
                                        icon={iconSponsorshipMini}
                                        iconLabel="Sponsorship"
                                        iconVisible={
                                            Number(
                                                sponsorAsset.minSponsoredAssetFee
                                            ) > 0
                                        }
                                        logo={sponsorAsset.logo}
                                        size="30px"
                                        flexShrink={0}
                                        popperOptions={popperOptions}
                                    />
                                    <Copy
                                        text={sponsorAsset.assetId}
                                        inititialTooltipLabel="Copy"
                                        copiedTooltipLabel="Copied!"
                                        ml="$10"
                                    >
                                        <Text
                                            color="standard.$0"
                                            variant="body2"
                                        >
                                            {sponsorAsset.assetId}
                                        </Text>
                                    </Copy>
                                </Flex>

                                <Text
                                    variant="body2"
                                    color="basic.$500"
                                    mb="$5"
                                >
                                    Sponsor Transaction Charge
                                </Text>

                                <Text
                                    color="standard.$0"
                                    variant="body2"
                                    mb="$20"
                                >
                                    {sponsorCharge}
                                </Text>

                                {isSponsorshipEnable && (
                                    <Flex
                                        p="15px"
                                        mb="20px"
                                        flexDirection="column"
                                        border="1px dashed"
                                        borderColor="#ffaf00"
                                        borderRadius="$4"
                                    >
                                        <Text
                                            color="#ffaf00"
                                            variant="body1"
                                            mb="$5"
                                        >
                                            Users will be able to pay
                                            transaction fees in{' '}
                                            {sponsorAsset.name}
                                        </Text>
                                        <Text
                                            color="basic.$300"
                                            variant="body2"
                                        >
                                            For each transaction, 0.001 WAVES
                                            will be deducted from your balance
                                            and {sponsorAsset.name} will be
                                            credited to your account. If you
                                            have the script account you will be
                                            cost 0.001 + 0.004 WAVES. The amount
                                            of {sponsorAsset.name} to be charged
                                            to users for transactions is set by
                                            you when you enable Sponsorship
                                            (enter the amount in the form
                                            above). Sponsorship will only work
                                            if you have a balance of at least
                                            1.005 WAVES. If your balance falls
                                            below this amount, you will be
                                            unable to sponsor transactions.
                                        </Text>
                                    </Flex>
                                )}

                                <Text
                                    variant="body2"
                                    color="basic.$500"
                                    mb="$5"
                                >
                                    Fee
                                </Text>
                                <Text variant="body2" color="standard.$0">
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
