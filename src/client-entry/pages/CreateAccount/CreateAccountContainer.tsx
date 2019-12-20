import { libs } from '@waves/waves-transactions';
import React, {
    FC,
    FocusEventHandler,
    MouseEventHandler,
    useCallback,
    useState,
} from 'react';
import { IUser } from '../../../interface';
import { addSeedUser } from '../../services/userService';
import { CreateAccountComponent } from './CreateAccountComponent';

interface IProps {
    networkByte: number;
    isPrivacyAccepted: boolean;
    isTermsAccepted: boolean;
    onConfirm: (user: IUser) => void;
    onCancel: () => void;
}

const MIN_PASSWORD_LENGTH = 8;

export const CreateAccount: FC<IProps> = ({
    networkByte,
    onConfirm,
    onCancel,
    isPrivacyAccepted: isPrivacyAcceptedProp,
    isTermsAccepted: isTermsAcceptedProp,
}) => {
    const [error, setError] = useState<boolean>(false);
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
                    setError(false);
                    break;
                case inputPasswordConfirmId:
                    setPasswordConfirm(event.target.value);
                    setError(false);
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

    const handlePasswordInputBlur = useCallback<
        FocusEventHandler<HTMLInputElement>
    >(() => {
        if (
            password.length > 0 &&
            passwordConfirm.length > 0 &&
            passwordConfirm !== password
        ) {
            setError(true);
        }
    }, [passwordConfirm, password]);

    const isSubmitEnabled =
        password.length >= MIN_PASSWORD_LENGTH &&
        passwordConfirm.length >= MIN_PASSWORD_LENGTH &&
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
            onPasswordInputBlur={handlePasswordInputBlur}
            isSubmitDisabled={!isSubmitEnabled}
            showTerms={!isPrivacyAcceptedProp && !isTermsAcceptedProp}
            minPasswordLength={MIN_PASSWORD_LENGTH}
            error={error}
        />
    );
};
