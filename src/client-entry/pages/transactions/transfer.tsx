import { Component } from 'react';
import React from 'react';
import { Recipient } from '../../components/Recipient';
import {
    AddressAvatar,
    Box,
    Icon,
    Flex,
    Text,
    Button,
    iconClose,
} from '@waves.exchange/react-uikit';
import { ISignTxProps } from '../../../interface';
import { ITransferWithType } from '@waves/waves-js/dist/src/interface';
import { toFormat } from '../../utils';
import { withTheme } from 'emotion-theming';
import { Modal } from '../../components/Modal';
import { TFeeInfo } from '@waves/node-api-js/es/api-node/transactions';

const Row = ({ keyData, value }: { keyData: string; value: any }) => (
    <Flex pb="10px" flexDirection="row" justifyContent="space-between">
        <Text color="#fff">{keyData}</Text>
        {value}
    </Flex>
);

export default withTheme(
    class Transfer extends Component<ISignTxProps<ITransferWithType>, TState> {
        public state: TState = { activeFeeItem: 0 };

        public render(): React.ReactElement {
            const props = this.props;
            const tx = props.tx;

            return (
                <Modal>
                    <Box
                        onClick={this.props.onCancel}
                        position="absolute"
                        right="20px"
                        top="20px"
                    >
                        <Icon icon={iconClose} />
                    </Box>
                    <Row
                        keyData={'Sign from'}
                        value={<AddressAvatar address={props.user.address} />}
                    />
                    <Row
                        keyData={'Type'}
                        value={<Text color="#fff">Transfer</Text>}
                    />
                    <Row
                        keyData={'Id'}
                        value={<Text color="#fff">{tx.id}</Text>}
                    />
                    <Row
                        keyData={'Amount'}
                        value={
                            <Text color="#fff">
                                {toFormat(
                                    tx.amount,
                                    tx.assetId,
                                    props.meta.assets
                                )}
                            </Text>
                        }
                    />
                    <Row
                        keyData={'Recipient'}
                        value={<Recipient recipient={tx.recipient} />}
                    />
                    {tx.attachment ?? (
                        <Row keyData={'Attachment'} value={tx.attachment} />
                    )}
                    <Row
                        keyData={'Fee'}
                        value={
                            props.meta.feeList.length === 1 ? (
                                <Text color="#fff">
                                    {toFormat(
                                        tx.fee,
                                        tx.feeAssetId,
                                        props.meta.assets
                                    )}
                                </Text>
                            ) : (
                                <select onChange={this.onChangeFee}>
                                    {props.meta.feeList.map(
                                        (fee: TFeeInfo, index: number) => (
                                            <option
                                                key={fee.feeAssetId ?? 'WAVES'}
                                                value={index}
                                            >
                                                {toFormat(
                                                    fee.feeAmount,
                                                    fee.feeAssetId,
                                                    props.meta.assets
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            )
                        }
                    />
                    <Button mt="20px" onClick={this.onConfirm}>
                        Ok
                    </Button>
                </Modal>
            );
        }

        private readonly onConfirm = (): void => {
            const fee = this.props.meta.feeList[this.state.activeFeeItem];

            this.props.onConfirm({
                ...this.props.tx,
                fee: fee.feeAmount,
                feeAssetId: fee.feeAssetId,
            });
        };

        private readonly onChangeFee = (event: any): void => {
            const activeFeeItem = Number(event.currentTarget.value);

            this.setState({ activeFeeItem });
        };
    }
);

interface TState {
    activeFeeItem: number;
}
