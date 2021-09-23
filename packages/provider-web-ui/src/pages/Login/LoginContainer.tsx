import React, {
    FC,
    MouseEventHandler,
    useCallback,
    useState,
    useEffect,
} from 'react';
import { IUser } from '../../interface';
import { LoginComponent } from './LoginComponent';
import { getUsers, addSeedUser, StorageUser } from '../../services/userService';
import { libs } from '@waves/waves-transactions';
import { analytics } from '../../utils/analytics';
import { SelectAccountComponent } from './SelectAccountComponent';

interface IProps {
    networkByte: number;
    onConfirm: (user: IUser) => void;
    onCancel: () => void;
    isIncognito: boolean;
}

export const Login: FC<IProps> = ({ networkByte, onConfirm, onCancel, isIncognito }) => {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [currentUser, setCurrentUser] = useState<StorageUser>();
    const [users, setUsers] = useState<StorageUser[]>();
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
                    name: 'Login_Page_SignIn_Success',
                    params: {
                        Accounts_Length: users.length,
                    },
                });

                if (users.length === 1) {
                    onConfirm(users[0]);

                    analytics.addDefaultParams({
                        userType: users[0].userType,
                    });
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
        (user: StorageUser): void => {
            setCurrentUser(user);
        },
        [setCurrentUser]
    );

    const handleContinue = useCallback<MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            e.preventDefault();
            currentUser && onConfirm(currentUser);

            analytics.addDefaultParams({
                userType: currentUser?.userType,
            });

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
    const title = hasMultipleUsers ? 'Select Account' : 'Log In';

    return (
        <LoginComponent
            title={title}
            errorMessage={errorMessage}
            showNotification={!hasMultipleUsers}
            inputPasswordId={inputPasswordId}
            onClose={handleClose}
            onLogin={handleLogin}
            password={password}
            onPasswordChange={handlePasswordChange}
            onForgotPasswordLinkClick={handleForgotPasswordLinkClick}
            isSubmitDisabled={isSubmitDisabled}
            isIncognito={isIncognito}
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
