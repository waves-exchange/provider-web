import React, {
    FC,
    MouseEventHandler,
    useCallback,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { IUser } from '../../../interface';
import { LoginComponent } from './LoginComponent';
import { getUsers, addSeedUser } from '../../services/userService';
import { libs } from '@waves/waves-transactions';
import { analytics } from '../../utils/analytics';
import { getEnvAwareUrl } from '../../utils/getEnvAwareUrl';
import { SelectAccountComponent } from './SelectAccountComponent';
import { ExternalLink, Text } from '@waves.exchange/react-uikit';

interface IProps {
    networkByte: number;
    onConfirm: (user: IUser) => void;
    onCancel: () => void;
}

export const Login: FC<IProps> = ({ networkByte, onConfirm, onCancel }) => {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [currentUser, setCurrentUser] = useState<IUser>();
    const [users, setUsers] = useState<IUser[]>();
    const [password, setPassword] = useState<string>('');

    const inputPasswordId = 'password';

    const handlePasswordChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            setErrorMessage(undefined);
            setPassword(event.target.value);
        },
        []
    );

    const handleClose = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        onCancel();

        if (!users || users.length === 1) {
            analytics.send({ name: 'Login_Page_Close' });
        } else {
            analytics.send({
                name: 'Select_Account_Page_Close',
            });
        }
    }, [onCancel, users]);

    const handleLogin = useCallback<MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            e.preventDefault();
            const { resolveData: users } = getUsers(password, networkByte);

            if (users) {
                analytics.send({
                    name: 'Login_Page_Login_Click_Success',
                    params: {
                        Accounts_Length: users.length, // eslint-disable-line @typescript-eslint/camelcase
                    },
                });

                if (users.length === 1) {
                    onConfirm(users[0]);
                } else if (users.length > 1) {
                    setUsers(users);
                } else {
                    const user = addSeedUser(
                        libs.crypto.randomSeed(15),
                        password,
                        networkByte
                    );

                    if (!user.ok) {
                        setErrorMessage('Unknown error');

                        return;
                    }

                    onConfirm({
                        address: libs.crypto.address(
                            user.resolveData.seed,
                            user.resolveData.networkByte
                        ),
                        privateKey: libs.crypto.privateKey(
                            user.resolveData.seed
                        ),
                    });
                }
            } else {
                analytics.send({ name: 'Login_Page_Login_Click_Error' });

                setErrorMessage('Incorrect password');
            }
        },
        [networkByte, onConfirm, password]
    );

    const handleUserChange = useCallback(
        (user: IUser): void => {
            setCurrentUser(user);
        },
        [setCurrentUser]
    );

    const handleContinue = useCallback<MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            e.preventDefault();
            currentUser && onConfirm(currentUser);

            analytics.send({
                name: 'Select_Account_Page_Continue',
            });
        },
        [currentUser, onConfirm]
    );

    const handleForgotPasswordLinkClick = useCallback(() => {
        analytics.send({ name: 'Login_Page_Forgot_Password' });
    }, []);

    useEffect(() => {
        if (!currentUser && Array.isArray(users) && users.length > 0) {
            handleUserChange(users[0]);
        }
    }, [currentUser, handleUserChange, users]);

    const hasMultipleUsers = users && users.length > 1;
    const isSubmitDisabled = !password || !password.length || !!errorMessage;
    const title = hasMultipleUsers ? 'Account Selection' : 'Log in';
    const subTitle = hasMultipleUsers
        ? (): ReactNode => (
              <Text
                  variant="body1"
                  mt="$10"
                  textAlign="center"
                  color="basic.$500"
              >
                  Choose one of your{' '}
                  <ExternalLink
                      href={getEnvAwareUrl()}
                      variant="body1"
                      target="_blank"
                  >
                      Waves.Exchange
                  </ExternalLink>{' '}
                  accounts.
              </Text>
          )
        : (): ReactNode => (
              <Text
                  variant="body1"
                  mt="$10"
                  textAlign="center"
                  color="basic.$500"
              >
                  Enter your{' '}
                  <ExternalLink
                      href={getEnvAwareUrl()}
                      variant="body1"
                      target="_blank"
                  >
                      Waves.Exchange
                  </ExternalLink>{' '}
                  password.
              </Text>
          );

    return (
        <LoginComponent
            title={title}
            subTitle={subTitle}
            errorMessage={errorMessage}
            showNotification={!hasMultipleUsers}
            inputPasswordId={inputPasswordId}
            onClose={handleClose}
            onLogin={handleLogin}
            password={password}
            onPasswordChange={handlePasswordChange}
            onForgotPasswordLinkClick={handleForgotPasswordLinkClick}
            isSubmitDisabled={isSubmitDisabled}
        >
            {hasMultipleUsers ? (
                <SelectAccountComponent
                    networkByte={networkByte}
                    onUserChange={handleUserChange}
                    users={users}
                    currentUser={currentUser}
                    onContinue={handleContinue}
                />
            ) : null}
        </LoginComponent>
    );
};
