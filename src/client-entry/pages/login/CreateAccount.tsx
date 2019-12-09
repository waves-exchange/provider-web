import { Component } from 'react';
import { Modal } from '../../components/Modal';
import {
    Box,
    CloseIcon,
    Logo,
    Text,
    Flex,
    Help,
    Button,
} from '@waves.exchange/react-uikit';
import { addUser, noTerms, saveTerms } from '../../services/userService';
import React from 'react';
import { IUser } from '../../../interface';
import { withTheme } from 'emotion-theming';
import { TDefaultTheme } from '@waves.exchange/react-uikit/dist/typings/interface';

interface TState {
    password: string;
    confirm: string;
    wrongConfirm: boolean;
    terms1: boolean;
    terms2: boolean;
}

interface TProps {
    networkByte: number;
    onConfirm: (user: IUser) => void;
    onCancel: () => void;
    theme: TDefaultTheme;
}

export default withTheme(
    class CreateAccount extends Component<TProps, TState> {
        public state: TState = {
            password: '',
            confirm: '',
            wrongConfirm: false,
            terms1: !noTerms(),
            terms2: !noTerms(),
        };

        private readonly onChangePass = (e: any) => {
            const input = e.target as HTMLInputElement;

            this.setState({
                password: input.value,
                wrongConfirm: false,
            });
        };

        private readonly onChangeConfirm = (e: any) => {
            const input = e.target as HTMLInputElement;

            this.setState({
                confirm: input.value,
                wrongConfirm: false,
            });
        };

        private readonly onContinue = () => {
            if (this.state.password === this.state.confirm) {
                saveTerms(true);
                this.props.onConfirm(
                    addUser(this.state.password, this.props.networkByte)
                );
            } else {
                this.setState({ wrongConfirm: true });
            }
        };

        public render() {
            const hasTerms = this.state.terms1 && this.state.terms2;
            const disabled = !(
                this.state.password.length !== 0 &&
                this.state.password === this.state.confirm &&
                hasTerms
            );

            return (
                <Modal>
                    <Box
                        onClick={this.props.onCancel}
                        position="absolute"
                        right="20px"
                        top="20px"
                    >
                        <CloseIcon />
                    </Box>
                    <Flex mb="20px" justifyContent="center">
                        <Logo />
                    </Flex>
                    <Flex justifyContent="center" mb="10px">
                        <Text
                            fontSize="22px"
                            color="white"
                            fontWeight="bold"
                            fontFamily="Roboto"
                        >
                            Account name
                        </Text>
                    </Flex>
                    <Flex justifyContent="center" mb="10px">
                        <Text
                            mr="10px"
                            fontSize="15px"
                            color="white"
                            fontFamily="Roboto"
                        >
                            Set a single password for all your Waves.Exchange
                            accounts.
                        </Text>
                        <Help direction="bottom" align="right">
                            <Box
                                color={this.props.theme.colors.standard[0]}
                                width="266px"
                            >
                                <Box mb="5px">
                                    <Text
                                        fontFamily="Roboto"
                                        fontSize="13px"
                                        fontWeight={500}
                                    >
                                        Enter this address into your Bitcoin
                                        client or wallet
                                    </Text>
                                </Box>
                                <Box mb="5px">
                                    <Text>
                                        Once the transaction is confirmed, the
                                        gateway will process the transfer of BTC
                                        to a token in your Waves account.
                                    </Text>
                                </Box>
                                <Box>
                                    <Text>
                                        Please note that the gateway doesn't
                                        apply any fees for this operation.
                                    </Text>
                                </Box>
                            </Box>
                        </Help>
                    </Flex>
                    <Flex flexDirection="column" mb="20px">
                        <Text color={this.props.theme.colors.standard[0]}>
                            Create password
                        </Text>
                        <input
                            onInput={this.onChangePass}
                            className="input"
                            type="password"
                        />
                    </Flex>
                    <Flex flexDirection="column" mb="20px">
                        <Text color={this.props.theme.colors.standard[0]}>
                            Confirm password
                        </Text>
                        <input
                            onInput={this.onChangeConfirm}
                            className="input"
                            type="password"
                        />
                        {this.state.wrongConfirm ? (
                            <Text>Password and confirm is not equal!</Text>
                        ) : null}
                    </Flex>
                    {noTerms()
                        ? [
                              <Flex mb="20px">
                                  <label>
                                      <input
                                          checked={this.state.terms1}
                                          onChange={this.createAcceptTermsHander(
                                              'terms1'
                                          )}
                                          type="checkbox"
                                      />
                                      <Text
                                          color={
                                              this.props.theme.colors
                                                  .standard[0]
                                          }
                                      >
                                          I have read and agree with the{' '}
                                          <a>Privacy Policy</a>.
                                      </Text>
                                  </label>
                              </Flex>,
                              <Flex mb="10px">
                                  <label>
                                      <input
                                          type="checkbox"
                                          checked={this.state.terms2}
                                          onChange={this.createAcceptTermsHander(
                                              'terms2'
                                          )}
                                      />
                                      <Text
                                          color={
                                              this.props.theme.colors
                                                  .standard[0]
                                          }
                                      >
                                          I have read and agree with the{' '}
                                          <a>Terms and Conditions</a>.
                                      </Text>
                                  </label>
                              </Flex>,
                          ]
                        : null}
                    <Button
                        disabled={disabled}
                        mt="10px"
                        mb="20px"
                        variant="primary"
                        onClick={this.onContinue}
                    >
                        Create user
                    </Button>
                    <Flex justifyContent="center">
                        <Text color={this.props.theme.colors.standard[0]}>
                            If you had an account, visit <a>Waves.Exchange</a>{' '}
                            to restore it.
                        </Text>
                    </Flex>
                </Modal>
            );
        }

        private createAcceptTermsHander(field: 'terms1' | 'terms2') {
            return (event: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ [field]: event.currentTarget!.checked } as any);
            };
        }
    }
);
