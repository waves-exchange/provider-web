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
    Text,
} from '@waves.exchange/react-uikit';
import React, { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { IUser } from '../../../interface';
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
    children,
}) => {
    const errorFontSize = '13px';
    const errorLineHeight = '15px';

    return (
        <Box bg="main.$800" width={520} borderRadius="$6" as="form">
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
                    fontWeight={500}
                >
                    {title}
                </Heading>

                {showNotification && (
                    <Text
                        fontSize="$13"
                        lineHeight="$16"
                        p={15}
                        color="standard.$0"
                        border="1px dashed"
                        borderColor="main.$500"
                        borderRadius="$4"
                        my="$20"
                        textAlign="left"
                    >
                        Don't worry! The dApp does not have access to your
                        tokens, seed phrases or passwords. These are stored
                        locally within your browser.
                    </Text>
                )}

                {children ? (
                    children
                ) : (
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

                        <ExternalLink
                            display="block"
                            textAlign="center"
                            href={getEnvAwareUrl('/faq#25')}
                            mt="$30"
                            variant="body2"
                            onClick={onForgotPasswordLinkClick}
                        >
                            Forgot your password?
                        </ExternalLink>
                    </>
                )}
            </Flex>
        </Box>
    );
};
