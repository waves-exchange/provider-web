import { compose } from 'ramda';
import React, { FC, MouseEventHandler, useCallback, useState } from 'react';
import { IUser } from '../../../interface';
import { LoginComponent } from './LoginComponent';
import { getMultiaccountData, getUsers } from './helpers';

interface IProps {
    networkByte: number;
    onConfirm: (user: IUser) => void;
    onCancel: () => void;
}

export const Login: FC<IProps> = ({ networkByte, onConfirm, onCancel }) => {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [currentUser, setCurrentUser] = useState<IUser>()
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

    const handleClose = useCallback<MouseEventHandler<HTMLButtonElement>>(
        () => onCancel(),
        [onCancel]
    );

    const handleLogin = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        try {
            const users = compose(
                getUsers(networkByte),
                getMultiaccountData
            )(password);

            if (users.length === 1) {
                onConfirm(users[0]);
            } else if (users.length > 1) {
                setUsers(users);
            } else {
                setErrorMessage('Could not retreive users');
            }
        } catch (error) {
            switch (error.message) {
                case 'Could not decrypt data':
                    setErrorMessage('Wrong password');
                    break;
                case 'Could not retreive users':
                    setErrorMessage('Could not retreive users');
                    break;
                default:
                    // TODO обработать json parse error
                    setErrorMessage('Unknown error');
                    break;
            }
        }
    }, [networkByte, onConfirm, password]);

    const handleUserChange = useCallback((user: IUser): void => {
        setCurrentUser(user);
    }, [setCurrentUser]);

    const handleContinue = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        currentUser && onConfirm(currentUser);
    }, [currentUser, onConfirm]);

    const hasMultipleUsers = users && users.length > 1;

    const title = hasMultipleUsers ? 'Account Selection' : 'Log in';
    const subTitle = hasMultipleUsers
        ? 'Enter your Waves.Exchange password.'
        : 'Choose one of your Waves.Exchange accounts.';

    return (
        <LoginComponent
            title={title}
            subTitle={subTitle}
            errorMessage={errorMessage}
            showNotification={!hasMultipleUsers}
            inputPasswordId={inputPasswordId}
            onClose={handleClose}
            onLogin={handleLogin}
            onContinue={handleContinue}
            password={password}
            onPasswordChange={handlePasswordChange}
            onUserChange={handleUserChange}
            users={hasMultipleUsers ? users : undefined}
        />
    );
};
