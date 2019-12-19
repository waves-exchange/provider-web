import React, { FC, MouseEventHandler } from 'react';

import {
    Box,
    Text,
    Flex,
    Button,
    IconButton,
    Icon,
    Heading,
    Label,
    InputPassword,
    Checkbox,
    ExternalLink,
    iconClose,
    iconLogo,
} from '@waves.exchange/react-uikit';

interface IProps {
    inputPasswordId: string;
    inputPasswordConfirmId: string;
    checkboxPrivacyId: string;
    checkboxTermsId: string;
    password: string;
    passwordConfirm: string;
    showTerms: boolean;
    isPrivacyAccepted: boolean;
    isTermsAccepted: boolean;
    isSubmitDisabled: boolean;
    onClose(event: React.MouseEvent<HTMLButtonElement>): void;
    onPasswordChange(event: React.ChangeEvent<HTMLInputElement>): void;
    onPasswordConfirmChange(event: React.ChangeEvent<HTMLInputElement>): void;
    onPrivacyAcceptedChange(event: React.ChangeEvent<HTMLInputElement>): void;
    onTermsAcceptedChange(event: React.ChangeEvent<HTMLInputElement>): void;
    onSubmit(event: React.MouseEvent<HTMLButtonElement>): void;
}

export const CreateAccount: FC<IProps> = ({
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
}) => {
    return (
        <Box bg="main.$800" width={520} borderRadius="$6">
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
                    color="standard.$0"
                >
                    Create Account
                </Heading>

                <Flex justifyContent="center">
                    <Text
                        variant="body1"
                        mt="$10"
                        mb="$20"
                        textAlign="center"
                        color="basic.$500"
                    >
                        Set a single password for all your Waves.Exchange
                        accounts.
                    </Text>
                </Flex>

                <Label
                    htmlFor={inputPasswordId}
                    pb="$5"
                    variant="body2"
                    color="standard.$0"
                >
                    Create password
                </Label>
                <InputPassword
                    id={inputPasswordId}
                    value={password}
                    onChange={onPasswordChange}
                />

                <Label
                    htmlFor={inputPasswordConfirmId}
                    mt={27}
                    pb="$5"
                    variant="body2"
                    color="standard.$0"
                >
                    Confirm password
                </Label>
                <InputPassword
                    id={inputPasswordConfirmId}
                    value={passwordConfirm}
                    onChange={onPasswordConfirmChange}
                />

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
                                href="https://waves.exchange/files/Privacy_Policy_Waves.Exchange.pdf"
                                variant="body2"
                            >
                                Privacy policy
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
                                href="https://waves.exchange/files/Terms_Of_Use_Waves.Exchange.pdf"
                                variant="body2"
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
                    onClick={onSubmit as MouseEventHandler<HTMLButtonElement>}
                    disabled={isSubmitDisabled}
                >
                    Sign up
                </Button>
                <Text
                    variant="body2"
                    mt="$20"
                    textAlign="center"
                    color="basic.$500"
                >
                    If you had an account, visit{' '}
                    <ExternalLink href="#" fontSize="$15">
                        Waves.Exchange
                    </ExternalLink>{' '}
                    to restore it.
                </Text>
            </Flex>
        </Box>
    );
};
