import {
    Box,
    Button,
    ExternalLink,
    Flex,
    Heading,
    Icon,
    IconButton,
    iconClose,
    iconLogo,
    InputPassword,
    Label,
    PlateNote,
    Text,
} from '@waves.exchange/react-uikit';
import React, { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { IUser } from '../../interface';
import { getEnvAwareUrl } from '../../utils/getEnvAwareUrl';

interface IProps {
    title: string;
    showNotification: boolean;
    errorMessage?: string;
    users?: IUser[];
    inputPasswordId: string;
    password: string;
    isSubmitDisabled: boolean;
    onClose: MouseEventHandler<HTMLButtonElement>;
    onPasswordChange: ChangeEventHandler<HTMLInputElement>;
    onLogin: MouseEventHandler<HTMLButtonElement>;
    onForgotPasswordLinkClick: MouseEventHandler;
    isIncognito: boolean;
}

export const LoginComponent: FC<IProps> = ({
    inputPasswordId,
    onClose,
    onLogin,
    password,
    onPasswordChange,
    title,
    showNotification,
    errorMessage,
    onForgotPasswordLinkClick,
    isSubmitDisabled,
    isIncognito,
    children,
}) => {
    const errorFontSize = '13px';
    const errorLineHeight = '15px';

    return (
        <Box bg="main.$800" width={520} borderRadius="$6" as="form">
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
                    {title}
                </Text>
                <IconButton
                    ml="auto"
                    size={25}
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
                {/*{showNotification && (*/}
                {/*    <Text*/}
                {/*        fontSize="$13"*/}
                {/*        lineHeight="$16"*/}
                {/*        p={15}*/}
                {/*        color="standard.$0"*/}
                {/*        border="1px dashed"*/}
                {/*        borderColor="main.$500"*/}
                {/*        borderRadius="$4"*/}
                {/*        my="$20"*/}
                {/*        textAlign="left"*/}
                {/*    >*/}
                {/*        Don't worry! The dApp does not have access to your*/}
                {/*        tokens, seed phrases or passwords. These are stored*/}
                {/*        locally within your browser.*/}
                {/*    </Text>*/}
                {/*)}*/}

                {children ? (
                    children
                ) : (
                    !isIncognito ? (
                        <>
                            <Label
                                htmlFor={inputPasswordId}
                                pb="$5"
                                variant="body2"
                                color="standard.$0"
                            >
                                Password
                            </Label>
                            <InputPassword
                                mb="$10"
                                id={inputPasswordId}
                                value={password}
                                onChange={onPasswordChange}
                                autoFocus={true}
                                aria-invalid={Boolean(errorMessage)}
                            />
                            <Box>
                                <Text
                                    sx={{
                                        maxHeight: errorMessage
                                            ? errorLineHeight
                                            : '0px',
                                        overflow: 'hidden',
                                        transition: 'all 0.2s ease',
                                        transformOrigin: 'top',
                                        willChange: 'transform',
                                    }}
                                    fontSize={errorFontSize}
                                    lineHeight={errorLineHeight}
                                    color="danger.$300"
                                >
                                    {errorMessage || <span>&nbsp;</span>}
                                </Text>
                                <ExternalLink
                                    display="block"
                                    textAlign="center"
                                    href={getEnvAwareUrl('/faq#25')}
                                    variant="body2"
                                    sx={{ float: 'right' }}
                                    fontSize="13px"
                                    lineHeight="16px"
                                    onClick={onForgotPasswordLinkClick}
                                >
                                    Forgot your password?
                                </ExternalLink>
                            </Box>

                            <Button
                                type="submit"
                                variant="primary"
                                variantSize="medium"
                                mt="$20"
                                onClick={onLogin}
                                disabled={isSubmitDisabled}
                            >
                                Log In
                            </Button>
                        </>
                    ) : (
                        <PlateNote type="error" color="standard.$0" fontSize="14px" lineHeight="20px">
                            The authorization in the incognito mode is unavailable.
                            Please, exit from the incognito mode and try again.
                        </PlateNote>
                    )
                )}
                {children ? null : (
                    <Box pt="24px" textAlign="center" fontWeight={300}>
                        <Text variant="footnote1" color="basic.$500">
                            Waves.Exchange
                        </Text>
                        <Text variant="footnote1" color="basic.$700">
                            {' '}
                            provider is used.{' '}
                        </Text>
                    </Box>
                )}
            </Flex>
        </Box>
    );
};
