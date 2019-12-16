import React, { FC, MouseEventHandler, useCallback, useState } from 'react';
import { IUser } from '../../../interface';
import { CreateAccount as CreateAccountComponent } from '../../components/CreateAccount';
import { addSeedUser } from '../../services/userService';
import { libs } from '@waves/waves-transactions';

interface IProps {
    networkByte: number;
    isPrivacyAccepted: boolean;
    isTermsAccepted: boolean;
    onConfirm: (user: IUser) => void;
    onCancel: () => void;
}

export const CreateAccount: FC<IProps> = ({
    networkByte,
    onConfirm,
    onCancel,
    isPrivacyAccepted: isPrivacyAcceptedProp,
    isTermsAccepted: isTermsAcceptedProp,
}) => {
    const [isPrivacyAccepted, setPrivacyAccepted] = useState<boolean>(
        isPrivacyAcceptedProp
    );
    const [isTermsAccepted, setTermsAccepted] = useState<boolean>(
        isTermsAcceptedProp
    );
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');

    const inputPasswordId = 'password';
    const inputPasswordConfirmId = 'password-confirm';
    const checkboxPrivacyId = 'privacy';
    const checkboxTermsId = 'terms';

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>): void => {
            switch (event.target.id) {
                case inputPasswordId:
                    setPassword(event.target.value);
                    break;
                case inputPasswordConfirmId:
                    setPasswordConfirm(event.target.value);
                    break;
                case checkboxPrivacyId:
                    setPrivacyAccepted(!isPrivacyAccepted);
                    break;
                case checkboxTermsId:
                    setTermsAccepted(!isTermsAccepted);
                    break;
                default:
                    break;
            }
        },
        [isPrivacyAccepted, isTermsAccepted]
    );

    const handleClose = useCallback<MouseEventHandler<HTMLButtonElement>>(
        () => onCancel(),
        [onCancel]
    );

    const handleSubmit = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        const user = addSeedUser(
            libs.crypto.randomSeed(15),
            password,
            networkByte
        );

        if (!user.ok) {
            console.error(user.rejectData);

            return void 0;
        }

        onConfirm({
            address: libs.crypto.address(
                user.resolveData.seed,
                user.resolveData.networkByte
            ),
            seed: user.resolveData.seed,
        });
    }, [networkByte, onConfirm, password]);

    const isSubmitEnabled =
        password.length > 0 &&
        password === passwordConfirm &&
        isPrivacyAccepted &&
        isTermsAccepted;

    return (
        <CreateAccountComponent
            inputPasswordId={inputPasswordId}
            inputPasswordConfirmId={inputPasswordConfirmId}
            checkboxPrivacyId={checkboxPrivacyId}
            checkboxTermsId={checkboxTermsId}
            onClose={handleClose}
            onSubmit={handleSubmit}
            password={password}
            passwordConfirm={passwordConfirm}
            isPrivacyAccepted={isPrivacyAccepted}
            isTermsAccepted={isTermsAccepted}
            onPrivacyAcceptedChange={handleInputChange}
            onTermsAcceptedChange={handleInputChange}
            onPasswordChange={handleInputChange}
            onPasswordConfirmChange={handleInputChange}
            isSubmitDisabled={!isSubmitEnabled}
            showTerms={!isPrivacyAcceptedProp && !isTermsAcceptedProp}
        />
    );
};
