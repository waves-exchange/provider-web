import {
    Box,
    Button,
    ExternalLink,
    Flex,
    Icon,
    IconButton,
    iconClose,
    Text,
    PlateNote,
} from '@waves.exchange/react-uikit';
import React, { FC, MouseEventHandler, } from 'react';

export type CreateAccountFormErrors = {
    passwordsDoNotMatch: string | null;
    passwordMinLength: string | null;
    passwordInsecure: string | null;
};

type CreateAccountComponentProps = {
    onClose: MouseEventHandler<HTMLButtonElement>;
    isIncognito: boolean;
};

export const CreateAccountComponent: FC<CreateAccountComponentProps> = ({ onClose , isIncognito}) => {
    return (
        <Box
            bg="main.$800"
            width={520}
            borderRadius="$6"
            boxShadow="0 0 30px rgba(0, 0, 0, 0.15)"
        >
            <Flex
                height={65}
                p="20px 24px 20px 40px"
                borderBottom="1px solid"
                borderColor="#3a4050"
                mb="32px"
                position="relative"
            >
                <Text
                    as="h2"
                    fontSize="17px"
                    lineHeight="24px"
                    mb="24px"
                    color="standard.$0"
                    fontWeight={500}
                    margin={0}
                >
                    Create account
                </Text>
                <IconButton
                    ml="auto"
                    size={22}
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
                {isIncognito ? (
                    <>
                        <PlateNote type="error" color="standard.$0" fontSize="14px" lineHeight="20px">
                            The authorization in the incognito mode is unavailable.
                            Please, exit from the incognito mode and try again.
                        </PlateNote>
                        <Box pt="24px" textAlign="center" fontWeight={300}>
                            <Text variant="footnote1" color="basic.$500">
                                Waves.Exchange
                            </Text>
                            <Text variant="footnote1" color="basic.$700">
                                {' '}
                                provider is used.{' '}
                            </Text>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box color="#c5d0de" fontSize="15px" lineHeight="20px" textAlign="center" mb="24px">
                            You have not imported any seed accounts. Please go to the Waves.exchange
                            <ExternalLink href="https://waves.exchange/sign-up/software"> Sign Up </ExternalLink>
                            page and create your account.
                        </Box>
                        <PlateNote type="warning" mb="24px">
                            <Box color="warning.$500" fontSize="14px" lineHeight="20px" mb="8px">If I can't find my account</Box>
                            <Box fontSize="13px" lineHeight="16px" color="basic.$300">
                                This could happen if you cleared your browser cache or started using a new browser or new device. You need to create a password again on the registration page and import your existing account with your seed, private key or Keystore File.
                            </Box>
                        </PlateNote>
                        <ExternalLink href="https://waves.exchange/sign-up/software">
                            <Button
                                variant="primary"
                                variantSize="medium"
                                width="100%"
                            >
                                Create Account
                            </Button>
                        </ExternalLink>
                    </>
                )}
            </Flex>
        </Box>
    );
};
