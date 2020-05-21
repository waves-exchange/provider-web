import {
    AssetLogoWithIcon,
    Box,
    Checkbox,
    Copy,
    ExternalLink,
    Flex,
    Icon,
    iconIssueTransaction,
    iconSmartMini,
    Label,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    TabsList,
    Text,
    useBoundedTooltip,
} from '@waves.exchange/react-uikit';
import { TLong } from '@waves/signer';
import { IIssueTransaction, IWithId } from '@waves/ts-types';
import React, { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { Confirmation } from '../../components/Confirmation';
import { DataJson } from '../../components/DataJson/DataJson';
import { Help } from '../../components/Help/Help';
import { TransactionDetails } from '../../components/TransactionDetails/TransactionDetails';

type Props = {
    fee: string;
    assetId: string;
    assetName: string;
    assetDescription: string;
    assetType: string;
    assetScript?: string | null;
    decimals: number;
    userAddress: string;
    userName: string;
    userBalance: string;
    issueAmount: string;
    canConfirm: boolean;
    onReject: MouseEventHandler<HTMLButtonElement>;
    onConfirm: MouseEventHandler<HTMLButtonElement>;
    onTermsCheck: ChangeEventHandler<HTMLInputElement>;
    tx: IIssueTransaction<TLong> & IWithId;
};

export const SignIssueComponent: FC<Props> = ({
    fee,
    assetId,
    assetName,
    assetDescription,
    assetType,
    assetScript,
    decimals,
    userAddress,
    userName,
    userBalance,
    issueAmount,
    onReject,
    onConfirm,
    onTermsCheck,
    canConfirm,
    tx,
}) => {
    const {
        boundaryRef: helpTooltipBoundaryRef,
        popperOptions: helpTooltipPopperOptions,
    } = useBoundedTooltip({
        left: 60,
        right: 60,
    });

    const {
        boundaryRef: assetLogoWithIconTooltipBoundaryRef,
        popperOptions: assetLogoWithIconPopperOptions,
    } = useBoundedTooltip({ left: 0 });

    return (
        <div ref={helpTooltipBoundaryRef}>
            <Confirmation
                address={userAddress}
                name={userName}
                balance={userBalance}
                onReject={onReject}
                onConfirm={onConfirm}
                canConfirm={canConfirm}
            >
                <Flex px="$40" py="$20" bg="main.$900">
                    <Flex
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="circle"
                        bg="rgba(38, 193, 201, 0.1)"
                        height={60}
                        width={60}
                        flexShrink={0}
                    >
                        <Icon
                            icon={iconIssueTransaction}
                            size={40}
                            color="#26c1c9"
                        />
                    </Flex>
                    <Flex ml="$20" flexDirection="column" overflowX="hidden">
                        <Text variant="body1" color="basic.$500">
                            Sign Issue TX
                        </Text>
                        <Text
                            fontSize={26}
                            lineHeight="32px"
                            color="standard.$0"
                            isTruncated={true}
                        >
                            {issueAmount}
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
                                ref={assetLogoWithIconTooltipBoundaryRef}
                            >
                                <Text variant="body2" color="basic.$500">
                                    Asset ID
                                </Text>
                                <Flex alignItems="center" mt="$5">
                                    <AssetLogoWithIcon
                                        assetId={assetId}
                                        name={assetName}
                                        size="30px"
                                        flexShrink={0}
                                        icon={iconSmartMini}
                                        iconVisible={Boolean(assetScript)}
                                        iconLabel="Smart asset"
                                        popperOptions={
                                            assetLogoWithIconPopperOptions
                                        }
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

                                {assetDescription ? (
                                    <>
                                        <Text
                                            mt="$20"
                                            variant="body2"
                                            color="basic.$500"
                                        >
                                            Asset Description
                                        </Text>
                                        <Text
                                            display="block"
                                            mt="$5"
                                            p="15px"
                                            variant="body2"
                                            color="standard.$0"
                                            bg="basic.$900"
                                            borderRadius="$4"
                                            maxHeight="85px"
                                            overflowY="auto"
                                        >
                                            {assetDescription}
                                        </Text>
                                    </>
                                ) : null}

                                <Flex mt={25}>
                                    <Flex flexDirection="column">
                                        <Flex alignItems="center">
                                            <Text
                                                mt="$25"
                                                mr="3px"
                                                variant="body2"
                                                color="basic.$500"
                                            >
                                                Asset Type
                                            </Text>

                                            <Help
                                                popperOptions={
                                                    helpTooltipPopperOptions
                                                }
                                            >
                                                <Text
                                                    variant="body1"
                                                    fontWeight={700}
                                                    display="block"
                                                >
                                                    This field defines the total
                                                    tokens supply that your
                                                    asset will contain.
                                                </Text>
                                                <Text
                                                    variant="body2"
                                                    display="block"
                                                    mt="5px"
                                                >
                                                    Reissuability allows for
                                                    additional tokens creation
                                                    that will be added to the
                                                    total token supply of asset.
                                                </Text>

                                                <Text
                                                    variant="body2"
                                                    display="block"
                                                    mt="5px"
                                                >
                                                    A non-reissuable asset will
                                                    be permanently limited to
                                                    the total token supply
                                                    defined during this steps.
                                                </Text>
                                            </Help>
                                        </Flex>
                                        <Text
                                            mt="5px"
                                            variant="body2"
                                            color="standard.$0"
                                        >
                                            {assetType}
                                        </Text>
                                    </Flex>
                                    <Flex ml={30} flexDirection="column">
                                        <Flex alignItems="center">
                                            <Text
                                                mt="$25"
                                                mr="3px"
                                                variant="body2"
                                                color="basic.$500"
                                            >
                                                Decimals
                                            </Text>
                                            <Help
                                                popperOptions={
                                                    helpTooltipPopperOptions
                                                }
                                            >
                                                <Text
                                                    variant="body1"
                                                    fontWeight={700}
                                                >
                                                    This field defines the
                                                    number of decimals your
                                                    asset token will be divided
                                                    in.
                                                </Text>
                                            </Help>
                                        </Flex>
                                        <Text
                                            mt="5px"
                                            variant="body2"
                                            color="standard.$0"
                                        >
                                            {decimals}
                                        </Text>
                                    </Flex>
                                </Flex>

                                {assetScript ? (
                                    <>
                                        <Flex
                                            alignItems="center"
                                            mr="3px"
                                            mt={25}
                                        >
                                            <Text
                                                variant="body2"
                                                color="basic.$500"
                                                mr="3px"
                                            >
                                                Smart Asset Script
                                            </Text>
                                            <Help
                                                showDelay={1500}
                                                popperOptions={
                                                    helpTooltipPopperOptions
                                                }
                                            >
                                                <Text
                                                    display="block"
                                                    variant="body1"
                                                    fontWeight={700}
                                                >
                                                    A Smart Asset is an asset
                                                    with an attached script that
                                                    places conditions on every
                                                    transaction made for the
                                                    token in question.
                                                </Text>
                                                <Text
                                                    display="block"
                                                    variant="body2"
                                                    mt="5px"
                                                >
                                                    Each validation of a
                                                    transaction by a Smart
                                                    Asset's script increases the
                                                    transaction fee by 0.004
                                                    WAVES. For example, if a
                                                    regular tx is made for a
                                                    Smart Asset, the cost is
                                                    0.001 + 0.004 = 0.005 WAVES.
                                                    If an exchange transaction
                                                    is made, the cost is 0.003 +
                                                    0.004 = 0.007 WAVES.
                                                    <ExternalLink
                                                        mt="$5"
                                                        variant="body2"
                                                        display="block"
                                                        href="https://docs.wavesplatform.com/en/building-apps/smart-contracts/smart-assets"
                                                        target="_blank"
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
                                    </>
                                ) : null}
                                <Box
                                    p={15}
                                    border="1px dashed"
                                    borderColor="main.$500"
                                    backgroundColor="main.$800"
                                    mt={20}
                                >
                                    <Text
                                        display="block"
                                        variant="body1"
                                        color="standard.$0"
                                    >
                                        You agree that:
                                    </Text>
                                    <Text
                                        display="block"
                                        mt="5px"
                                        variant="body2"
                                        color="basic.$300"
                                    >
                                        I) You will not use the token for
                                        fraudulent purposes;
                                    </Text>
                                    <Text
                                        display="block"
                                        variant="body2"
                                        color="basic.$300"
                                    >
                                        II) You will not duplicate, fully or in
                                        part, the name of an existing
                                        cryptocurrency or a well-known company
                                        with the aim of misleading users;
                                    </Text>
                                    <Text
                                        display="block"
                                        variant="body2"
                                        color="basic.$300"
                                    >
                                        III) You will not use names of states,
                                        other administrative units or municipal
                                        insitutions for the token's name with
                                        the aim of misleading users;
                                    </Text>
                                    <Text
                                        display="block"
                                        variant="body2"
                                        color="basic.$300"
                                    >
                                        IV) You will not set a script on a smart
                                        asset that limits exchange transactions
                                        on Waves.Exchange by asset quantity;
                                    </Text>
                                    <Text
                                        display="block"
                                        variant="body2"
                                        color="basic.$300"
                                    >
                                        V) You will not give false information
                                        in a smart asset's description
                                        concerning the rules governing the
                                        token's use, which do not correspond to
                                        those of the script installed on it;
                                    </Text>
                                </Box>
                                <Flex alignItems="flex-start" mt={20}>
                                    <Checkbox
                                        id="terms"
                                        onChange={onTermsCheck}
                                    />
                                    <Label
                                        htmlFor="terms"
                                        pl="10px"
                                        color="basic.$500"
                                        textAlign="justify"
                                        fontSize="13px"
                                        lineHeight="18px"
                                    >
                                        I understand that in the case of
                                        non-compliance with the rules, my token
                                        will be categorised as "Suspicious", and
                                        will be available for search only by ID
                                    </Label>
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
