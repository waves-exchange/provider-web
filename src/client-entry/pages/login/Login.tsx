import { libs, seedUtils } from '@waves/waves-transactions';
import { Modal } from '../../components/Modal'
import { Component, Fragment } from 'react';
import { Box, CloseIcon, Logo, Text, Flex, Button } from '@waves/react-uikit';
import { withTheme } from 'emotion-theming';
import React = require('react');
import { TDefaultTheme } from '@waves/react-uikit/dist/typings/interface';
import { IUser } from '../../../interface';


type TProps = {
    networkByte: number;
    onConfirm: (user: IUser) => void;
    onCancel: () => void;
    theme: TDefaultTheme;
};
type TState = {
    activeUser: string;
    password: string;
    users: Array<IUser>;
    passwordError: boolean;
};

export default withTheme(class Login extends Component<TProps, TState> {

    public state: TState = {
        activeUser: '',
        password: '',
        passwordError: false,
        users: []
    };

    private onChangeUser = (e: any) => { // TODO
        this.setState({
            activeUser: (e.target as HTMLInputElement).value
        });
    };

    private onChangePass = (e: any) => { // TODO
        this.setState({
            'passwordError': false,
            'password': (e.target as HTMLInputElement).value
        });
    };

    private onEnterPassword = () => {
        const state = this.state;
        const encryptedData = localStorage.getItem('multiAccountData');
        const json = encryptedData && decrypt(encryptedData, state.password);

        if (!json) {
            this.setState({ 'passwordError': true });
            return void 0;
        }

        try {
            const data = JSON.parse(json);
            const users = Object.keys(data).map(id => ({
                address: libs.crypto.address(data[id].seed, this.props.networkByte),
                seed: data[id].seed
            }));

            if (users.length === 1) {
                this.props.onConfirm({
                    address: users[0].address,
                    seed: users[0].seed
                });
            } else {
                this.setState({
                    activeUser: users[0].address,
                    users: users
                });
            }
        } catch (e) {
            this.setState({ 'passwordError': true });
        }
    };

    private onKeyPress = (e: any) => { // TODO
        if (e.code === 'Enter') {
            this.onEnterPassword();
        }
    };

    private onConfirm = () => {
        this.props.onConfirm(this.state.users.find(item => item.address === this.state.activeUser)!);
    };

    public render() {
        const props = this.props;
        const state = this.state;

        return (
            <Modal>
                <Box onClick={this.props.onCancel} position="absolute" right="20px" top="20px"><CloseIcon /></Box>
                <Flex mb="20px" justifyContent="center"><Logo /></Flex>
                <Flex justifyContent="center" mb="10px">
                    <Text fontSize="22px" color="white" fontWeight="bold" fontFamily="Roboto">Login</Text>
                </Flex>
                <Flex justifyContent="center" mb="10px">
                    <Text fontSize="15px" color="white" fontFamily="Roboto">Enter your Waves.Exchange password.</Text>
                </Flex>
                <Box mb="20px" border="dashed 1px" borderColor="main.$500" p="16px">
                    <Text color="#fff">Don't worry! The dApp won't have access to your tokens, seed phrases or passwords. They are stored locally within your browser.</Text>
                </Box>
                {
                    !state.users.length
                        ?
                        <Fragment>
                            <Flex mb="30px" flexDirection="column">
                                <Text color="#fff">Passowrd</Text>
                                <input onInput={this.onChangePass}
                                    onKeyPress={this.onKeyPress} className="input"
                                    type="password" />
                                {state.passwordError ? <Text color="danger.$500">Wrong password!</Text> : null}
                            </Flex>

                            <Button onClick={this.onEnterPassword}>
                                Confirm
                            </Button>
                        </Fragment>
                        :
                        <Fragment>
                            <select value={state.users[0].address} onChange={this.onChangeUser}>
                                {state.users.map(user => <option value={user.address}>{user.address}</option>)}
                            </select>
                            <div className="popup-footer">
                                <button onClick={props.onCancel} className="button button-cancel">Cancel</button>
                                <button onClick={this.onConfirm}
                                    className="button button-confirm">
                                    Select user
                                </button>
                            </div>
                        </Fragment>
                }
            </Modal>
        );
    }

})

function decrypt(data: string, password: string) {
    try {
        return seedUtils.decryptSeed(data, password, 5000);
    } catch (e) {
        return null;
    }
}
