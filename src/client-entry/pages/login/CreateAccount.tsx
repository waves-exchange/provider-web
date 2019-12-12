import { Component } from 'react';
import { libs } from '@waves/waves-transactions';
import { addUser, termsAccepted, saveTerms } from '../../services/userService';
import React from 'react';
import { IUser } from '../../../interface';
import { withTheme } from 'emotion-theming';

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
}

export default withTheme(
    class CreateAccount extends Component<TProps, TState> {
        public state: TState = {
            password: '',
            confirm: '',
            wrongConfirm: false,
            terms1: !termsAccepted(),
            terms2: !termsAccepted(),
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

        private readonly onContinue = (): void => {
            if (this.state.password === this.state.confirm) {
                saveTerms(true);

                const user = addUser(
                    libs.crypto.randomSeed(15),
                    this.state.password,
                    this.props.networkByte
                );

                this.props.onConfirm({
                    address: libs.crypto.address(
                        {
                            publicKey: user.publicKey,
                        },
                        user.networkByte
                    ),
                    seed: user.seed as string,
                });
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

            return <p>modal</p>;
        }

        private createAcceptTermsHander(field: 'terms1' | 'terms2') {
            return (event: React.ChangeEvent<HTMLInputElement>) => {
                this.setState({ [field]: event.currentTarget!.checked } as any);
            };
        }
    }
);
