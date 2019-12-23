import React, { FC, MouseEventHandler, useCallback, useState } from 'react';
import { IUser } from '../../../interface';
import { LoginComponent } from './LoginComponent';
import { getUsers, addSeedUser } from '../../services/userService';
import { libs } from '@waves/waves-transactions';

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

    const handleClose = useCallback<MouseEventHandler<HTMLButtonElement>>(
        () => onCancel(),
        [onCancel]
    );

    const handleLogin = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        const { resolveData: users } = getUsers(password, networkByte);

        if (users) {
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
                    seed: user.resolveData.seed,
                });
            }
        } else {
            setErrorMessage('Incorrect password');
        }
    }, [networkByte, onConfirm, password]);

    const handleUserChange = useCallback(
        (user: IUser): void => {
            setCurrentUser(user);
        },
        [setCurrentUser]
    );

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
