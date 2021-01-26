import {
    Box,
    Button,
    Checkbox,
    ExternalLink,
    Flex,
    Heading,
    Icon,
    IconButton,
    iconClose,
    iconLogo,
    InputPassword,
    Label,
    Text,
    Help,
} from '@waves.exchange/react-uikit';
import React, {
    ChangeEventHandler,
    FC,
    FocusEventHandler,
    MouseEventHandler,
} from 'react';
import { getEnvAwareUrl } from '../../utils/getEnvAwareUrl';

export type CreateAccountFormErrors = {
    passwordsDoNotMatch: string | null;
    passwordMinLength: string | null;
    passwordInsecure: string | null;
};

type CreateAccountComponentProps = {
    inputPasswordId: string;
    inputPasswordConfirmId: string;
    checkboxPrivacyId: string;
    checkboxTermsId: string;
    errors: CreateAccountFormErrors;
    password: string;
    passwordConfirm: string;
    showTerms: boolean;
    isPrivacyAccepted: boolean;
    isTermsAccepted: boolean;
    isSubmitDisabled: boolean;
    onClose: MouseEventHandler<HTMLButtonElement>;
    onPasswordChange: ChangeEventHandler<HTMLInputElement>;
    onPasswordConfirmChange: ChangeEventHandler<HTMLInputElement>;
    onPrivacyAcceptedChange: ChangeEventHandler<HTMLInputElement>;
    onTermsAcceptedChange: ChangeEventHandler<HTMLInputElement>;
    onSubmit: MouseEventHandler<HTMLButtonElement>;
    onPasswordInputBlur: FocusEventHandler<HTMLInputElement>;
    onExchangeLinkClick: MouseEventHandler;
};

export const CreateAccountComponent: FC<CreateAccountComponentProps> = ({
    errors,
    showTerms,
    isPrivacyAccepted,
    isTermsAccepted,
    onPrivacyAcceptedChange,
    onTermsAcceptedChange,
    inputPasswordId,
    inputPasswordConfirmId,
    checkboxPrivacyId,
    checkboxTermsId,
    onClose,
    onSubmit,
    password,
    passwordConfirm,
    onPasswordChange,
    onPasswordConfirmChange,
    isSubmitDisabled,
    onPasswordInputBlur,
    onExchangeLinkClick,
}) => {
    return (
        <Box
            bg="main.$800"
            width={520}
            borderRadius="$6"
            boxShadow="0 0 30px rgba(0, 0, 0, 0.15)"
        >
            <Flex height={65}>
                <IconButton
                    ml="auto"
                    size={56}
                    color="basic.$700"
                    _hover={{ color: 'basic.$500' }}
                    onClick={onClose}
                >
                    <Icon icon={iconClose} />
                </IconButton>
            </Flex>
            <Flex
                px="$40"
                pb="$40"
                flexDirection="column"
                justifyContent="center"
            >
                <Icon display="block" mx="auto" size={80} icon={iconLogo} />
                <Heading
                    level={2}
                    textAlign="center"
                    mt="$20"
                    mb="$10"
                    color="standard.$0"
                    fontWeight={500}
                >
                    Log In with Waves.Exchange
                </Heading>

                <Flex justifyContent="center" alignItems="center" mb="$20">
                    <Text
                        variant="body1"
                        textAlign="center"
                        color="basic.$500"
                        mr="6px"
                    >
                        Create account.
                    </Text>
                    <Help direction="bottom">
                        <Box width="300px">
                            <Text>
                                The dApp won't have access to your password.
                                This is stored locally within your browser.
                            </Text>
                        </Box>
                    </Help>
                </Flex>

                <Label
                    htmlFor={inputPasswordId}
                    pb="$5"
                    variant="body2"
                    color="standard.$0"
                >
                    Create Password
                </Label>
                <InputPassword
                    id={inputPasswordId}
                    value={password}
                    aria-invalid={Boolean(
                        errors.passwordMinLength || errors.passwordInsecure
                    )}
                    onChange={onPasswordChange}
                    onBlur={onPasswordInputBlur}
                />

                {errors.passwordMinLength && (
                    <Text
                        fontSize="12px"
                        lineHeight="14px"
                        color="danger.$300"
                        textAlign="right"
                        display="inline-block"
                        width="100%"
                    >
                        {errors.passwordMinLength}
                    </Text>
                )}

                {errors.passwordInsecure && (
                    <Text
                        fontSize="12px"
                        lineHeight="14px"
                        color="danger.$300"
                        textAlign="right"
                        display="inline-block"
                        width="100%"
                    >
                        {errors.passwordInsecure}
                    </Text>
                )}

                <Label
                    htmlFor={inputPasswordConfirmId}
                    mt="16px"
                    pb="$5"
                    variant="body2"
                    color="standard.$0"
                >
                    Confirm Password
                </Label>
                <InputPassword
                    mb="$10"
                    id={inputPasswordConfirmId}
                    value={passwordConfirm}
                    aria-invalid={Boolean(errors.passwordsDoNotMatch)}
                    onChange={onPasswordConfirmChange}
                    onBlur={onPasswordInputBlur}
                />

                {errors.passwordsDoNotMatch && (
                    <Text
                        fontSize="12px"
                        lineHeight="12px"
                        color="danger.$300"
                        textAlign="right"
                        display="inline-block"
                        width="100%"
                    >
                        {errors.passwordsDoNotMatch}
                    </Text>
                )}

                {showTerms ? (
                    <>
                        <Flex alignItems="center" mt="$20">
                            <Checkbox
                                color="standard.$0"
                                id={checkboxPrivacyId}
                                checked={isPrivacyAccepted}
                                onChange={onPrivacyAcceptedChange}
                            >
                                <Text pl="$10" variant="body2">
                                    I have read and agree with the&nbsp;
                                </Text>
                            </Checkbox>
                            <ExternalLink
                                href={getEnvAwareUrl(
                                    '/files/Privacy_Policy_Waves.Exchange.pdf'
                                )}
                                variant="body2"
                            >
                                Privacy Policy
                            </ExternalLink>
                        </Flex>

                        <Flex alignItems="center" mt="$20">
                            <Checkbox
                                color="standard.$0"
                                id={checkboxTermsId}
                                checked={isTermsAccepted}
                                onChange={onTermsAcceptedChange}
                            >
                                <Text pl="$10" variant="body2">
                                    I have read and agree with the&nbsp;
                                </Text>
                            </Checkbox>
                            <ExternalLink
                                href={getEnvAwareUrl(
                                    '/files/Terms_Of_Use_Waves.Exchange.pdf'
                                )}
                                variant="body2"
                                target="_blank"
                            >
                                Terms and Conditions
                            </ExternalLink>
                        </Flex>
                    </>
                ) : null}

                <Button
                    type="submit"
                    variant="primary"
                    variantSize="medium"
                    mt="$30"
                    onClick={onSubmit}
                    disabled={isSubmitDisabled}
                >
                    Sign Up
                </Button>
                <Text
                    variant="body2"
                    mt="$20"
                    textAlign="center"
                    color="basic.$500"
                >
                    If you had an account, visit{' '}
                    <ExternalLink
                        href={getEnvAwareUrl()}
                        variant="body2"
                        onClick={onExchangeLinkClick}
                    >
                        Waves.Exchange
                    </ExternalLink>{' '}
                    to restore it.
                </Text>
            </Flex>
        </Box>
    );
};
