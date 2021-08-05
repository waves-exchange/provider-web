import { libs } from '@waves/waves-transactions';
import React, {
    FC,
    FocusEventHandler,
    MouseEventHandler,
    useCallback,
    useState,
} from 'react';
import { IUser } from '../../interface';
import { addSeedUser } from '../../services/userService';
import {
    CreateAccountComponent,
    CreateAccountFormErrors,
} from './CreateAccountComponent';
import { analytics } from '../../utils/analytics';

type CreateAccountProps = {
    networkByte: number;
    isPrivacyAccepted: boolean;
    isTermsAccepted: boolean;
    onConfirm(user: IUser): void;
    onCancel(): void;
};

export const CreateAccount: FC<CreateAccountProps> = ({
    networkByte,
    onConfirm,
    onCancel,
    isPrivacyAccepted: isPrivacyAcceptedProp,
    isTermsAccepted: isTermsAcceptedProp,
}) => {
    const MIN_PASSWORD_LENGTH = 8;
    const [errors, setErrors] = useState<CreateAccountFormErrors>({
        passwordMinLength: null,
        passwordInsecure: null,
        passwordsDoNotMatch: null,
    });
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
                    setErrors((prev) => ({
                        ...prev,
                        passwordMinLength: null,
                        passwordInsecure: null,
                    }));
                    break;
                case inputPasswordConfirmId:
                    setPasswordConfirm(event.target.value);
                    setErrors((prev) => ({
                        ...prev,
                        passwordsDoNotMatch: null,
                    }));
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

    const handleClose = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        analytics.send({ name: 'Create_Account_Page_Close' });

        onCancel();
    }, [onCancel]);

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

        analytics.send({ name: 'Login_Page_SignUp_Success' });

        onConfirm({
            address: libs.crypto.address(
                user.resolveData.seed,
                user.resolveData.networkByte
            ),
            privateKey: libs.crypto.privateKey(user.resolveData.seed),
        });
    }, [networkByte, onConfirm, password]);

    const handlePasswordInputBlur = useCallback<
        FocusEventHandler<HTMLInputElement>
    >(() => {
        const passwordMissedReqList: Array<string | boolean> = [
            /[a-z]/.test(password) || 'lowercase letter',
            /[A-Z]/.test(password) || 'uppercase letter',
            /[0-9]/.test(password) || 'number',
            /[$-/:-?{-~!^_`[\]@#]/.test(password) || 'special character',
        ].filter((x) => typeof x === 'string');

        setErrors((prev) => ({
            ...prev,
            passwordMinLength:
                password.length < MIN_PASSWORD_LENGTH
                    ? 'The password must be at least 8 characters long'
                    : null,
            passwordInsecure: passwordMissedReqList.length
                ? `Easy, add a ${passwordMissedReqList.join(', ')}`
                : null,
            passwordsDoNotMatch:
                password.length > 0 &&
                passwordConfirm.length > 0 &&
                passwordConfirm !== password
                    ? 'Passwords do not match'
                    : null,
        }));
    }, [passwordConfirm, password]);

    const handleExchangeLinkClick = useCallback(() => {
        analytics.send({
            name: 'Create_Account_Page_Waves_Exchange_Link_Click',
        });
    }, []);

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
            errors={errors}
            onExchangeLinkClick={handleExchangeLinkClick}
        />
    );
};
