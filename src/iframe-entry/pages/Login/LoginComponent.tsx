import {
    AddressAvatar,
    Box,
    Button,
    ExternalLink,
    Flex,
    Heading,
    Icon,
    IconButton,
    iconCheck,
    iconClose,
    iconLogo,
    InputPassword,
    Label,
    RadioButtonGroup,
    RadioButtonProps,
    Text,
} from '@waves.exchange/react-uikit';
import React, {
    ChangeEventHandler,
    FC,
    MouseEventHandler,
    KeyboardEventHandler,
} from 'react';
import { IUser } from '../../../interface';

const RadioUser: FC<RadioButtonProps<IUser>> = ({
    children,
    checked,
    value: _value,
    ...rest
}) => (
    <Button
        aria-checked={checked}
        cursor="pointer"
        bg="transparent"
        p="0"
        sx={{ outline: 0, ':hover': { bg: 'main.$600' } }}
        {...rest}
    >
        <Flex
            display="flex"
            alignItems="center"
            height="50px"
            px="8px"
            borderRadius="$4"
        >
            <Box flex={1}>{children}</Box>
            {checked && (
                <Icon icon={iconCheck} color="primary.$300" size="24px" />
            )}
        </Flex>
    </Button>
);

interface IProps {
    title: string;
    subTitle: string;
    showNotification: boolean;
    errorMessage?: string;
    users?: IUser[];
    inputPasswordId: string;
    password: string;
    isSubmitDisabled: boolean;
    onClose: MouseEventHandler<HTMLButtonElement>;
    onPasswordChange: ChangeEventHandler<HTMLInputElement>;
    onLogin: MouseEventHandler<HTMLButtonElement>;
    onContinue: MouseEventHandler<HTMLButtonElement>;
    currentUser?: IUser;
    onUserChange?: (value: IUser) => void;
    onForgotPasswordLinkClick: MouseEventHandler;
}

export const LoginComponent: FC<IProps> = ({
    inputPasswordId,
    onClose,
    onLogin,
    onContinue,
    password,
    onPasswordChange,
    users,
    title,
    subTitle,
    showNotification,
    errorMessage,
    currentUser,
    onUserChange,
    onForgotPasswordLinkClick,
    isSubmitDisabled,
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

                <Flex justifyContent="center">
                    <Text
                        variant="body1"
                        mt="$10"
                        textAlign="center"
                        color="basic.$500"
                    >
                        {subTitle}
                    </Text>
                </Flex>

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

                {users ? (
                    <>
                        <RadioButtonGroup
                            direction="column"
                            px="8px"
                            bg="basic.$900"
                            border="1px solid"
                            borderColor="main.$600"
                            borderRadius="$4"
                            maxHeight="180px"
                            overflow="auto"
                            mt="20px"
                            value={currentUser}
                            onChange={onUserChange as (value: unknown) => void}
                        >
                            {users.map((user) => (
                                <RadioUser key={user.address} value={user}>
                                    <AddressAvatar
                                        address={user.address}
                                    ></AddressAvatar>
                                </RadioUser>
                            ))}
                        </RadioButtonGroup>

                        <Button
                            type="submit"
                            variant="primary"
                            variantSize="medium"
                            mt="$30"
                            onClick={onContinue}
                        >
                            Confirm
                        </Button>
                    </>
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
                            href="https://waves.exchange/faq#25"
                            target="_blank"
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
