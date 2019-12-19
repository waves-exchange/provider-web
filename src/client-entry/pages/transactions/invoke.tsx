import {
    AddressAvatar,
    Icon,
    Flex,
    Text,
    Heading,
    Box,
    iconInvoke,
} from '@waves.exchange/react-uikit';
import React, { FC } from 'react';
import { WithId } from '@waves/waves-transactions/src/transactions';
import { IInvokeScriptTransaction } from '@waves/waves-transactions';
import { ISignTxProps } from '../../../interface';
import { IInvokeWithType } from '@waves/waves-js/dist/src/interface';
import { withTheme } from 'emotion-theming';
import { Confirmation } from '../../components/Confirmation';
import { AssetLogo } from '@waves.exchange/react-uikit/dist/esm/components/AssetLogo/AssetLogo';

const Invoke: FC<ISignTxProps<IInvokeWithType>> = (props) => {
    const tx = props.tx;

    return (
        <Confirmation
            address={props.user.address}
            name="Name"
            balance="123"
            onReject={props.onCancel}
            onConfirm={(): void => props.onConfirm(tx)}
        >
            <Box px="$40">
                <Flex mb="$20">
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
                    {tx.payment && (
                        <Flex justifyContent="center" flexDirection="column">
                            <Text variant="body1" color="basic.$500" mb="$3">
                                Sign Invoke Script TX
                            </Text>
                            <Heading variant="heading2" color="standard.$0">
                                {tx.payment.length} Payments
                            </Heading>
                        </Flex>
                    )}
                </Flex>

                <Box mb="$20">
                    <Text variant="body2" color="basic.$500" mb="$3" as="div">
                        Account
                    </Text>
                    <AddressAvatar address={tx.dApp} />
                </Box>

                {tx.payment && (
                    <Box mb="$20">
                        <Text variant="body2" color="basic.$500" as="div">
                            Payments
                        </Text>
                        <Flex flexDirection="column">
                            {tx.payment.map(({ assetId, amount }) => (
                                <Flex key={assetId}>
                                    <Box>
                                        <AssetLogo
                                            variant="large"
                                            assetId={assetId}
                                            name={'d'}
                                        />
                                    </Box>
                                    <Box>{amount}</Box>
                                    <Box>{assetId}</Box>
                                </Flex>
                            ))}
                        </Flex>
                    </Box>
                )}

                <Box mb="$20">
                    <Text variant="body2" color="basic.$500" as="div">
                        Call function
                    </Text>
                    <Text>{JSON.stringify(tx.call)}</Text>
                </Box>

                <Box mb="$30">
                    <Text variant="body2" color="basic.$500" as="div">
                        Fee
                    </Text>
                    <Text variant="body2">{tx.fee}</Text>
                </Box>
            </Box>
        </Confirmation>
    );
};

export interface IProps {
    networkByte: number;
    sender: string;
    tx: IInvokeScriptTransaction & WithId;
    onConfirm: () => void;
    onCancel: () => void;
}

export default withTheme(Invoke);
