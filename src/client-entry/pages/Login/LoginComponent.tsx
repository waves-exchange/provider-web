import React, { FC, MouseEventHandler, ChangeEventHandler } from 'react';
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
    ExternalLink,
    iconClose,
    iconLogo,
    RadioButtonGroup,
    AddressAvatar,
    RadioButtonProps,
    iconCheck,
} from '@waves.exchange/react-uikit';
import { IUser } from '../../../interface';

const RadioUser: FC<RadioButtonProps<IUser>> = ({
    children,
    checked,
    value,
    ...rest
}) => (
    <Button
        aria-checked={checked}
        cursor="pointer"
        bg="transparent"
        sx={{ ':hover': { bg: 'main.$600' } }}
        {...rest}
    >
        <Flex
            display="flex"
            alignItems="center"
            height="50px"
            pl="8px"
            pr="16px"
            borderRadius="$4"
        >
            <Box flex={1}>{children}</Box>
            {checked && (
                <Icon icon={iconCheck} color="primary.$300" size="18px" />
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
    onClose: MouseEventHandler<HTMLButtonElement>;
    onPasswordChange: ChangeEventHandler<HTMLInputElement>;
    onLogin: MouseEventHandler<HTMLButtonElement>;
    onContinue: MouseEventHandler<HTMLButtonElement>;
    onUserChange?: (value: IUser) => void;
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
    onUserChange,
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
                    {title}
                </Heading>

                <Flex justifyContent="center">
                    <Text
                        variant="body1"
                        mt="$10"
                        mb="$20"
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
                        textAlign="center"
                    >
                        Don't worry! The dApp won't have access to your tokens,
                        seed phrases or passwords. They are stored locally
                        within your browser.
                    </Text>
                )}

                {users ? (
                    <>
                        <RadioButtonGroup
                            direction="column"
                            px="$10"
                            bg="basic.$900"
                            border="1px solid"
                            borderColor="main.$600"
                            borderRadius="$4"
                            maxHeight="180px"
                            overflow="auto"
                            value={users[0]}
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
                            id={inputPasswordId}
                            value={password}
                            onChange={onPasswordChange}
                        />
                        {errorMessage && (
                            <Text mt="$10" fontSize="13px" color="danger.$300">
                                {errorMessage}
                            </Text>
                        )}
                        <Button
                            type="submit"
                            variant="primary"
                            variantSize="medium"
                            mt="$30"
                            onClick={onLogin}
                        >
                            Log In
                        </Button>
                        <ExternalLink
                            display="block"
                            textAlign="center"
                            href="https://waves.exchange/faq#25"
                            target="_blank"
                            mt="$30"
                            variant="body1"
                        >
                            Forgot password
                        </ExternalLink>
                    </>
                )}
            </Flex>
        </Box>
    );
};
