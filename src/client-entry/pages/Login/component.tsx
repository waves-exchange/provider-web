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
    RadioGroup,
    AddressAvatar,
    RadioProps,
    iconCheck,
    Radio,
} from '@waves.exchange/react-uikit';
import { IUser } from '../../../interface';

const RadioUser: FC<RadioProps> = ({ children, checked, ...rest }) => (
    <Radio
        customControlBox={true}
        px="$5"
        py="$10"
        borderRadius="$4"
        checked={checked}
        cursor="pointer"
        sx={{ ':hover': { bg: 'main.$600' } }}
        {...rest}
    >
        <Box flex={1}>{children}</Box>

        {checked && <Icon icon={iconCheck} color="primary.$300" size="20px" />}
    </Radio>
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
}

export const Login: FC<IProps> = ({
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
                        <RadioGroup
                            direction="column"
                            px="$10"
                            bg="basic.$900"
                            maxHeight="180px"
                            overflow="auto"
                            value={users[0].address}
                        >
                            {users.map((user) => (
                                <RadioUser
                                    key={user.address}
                                    value={user.address}
                                >
                                    <AddressAvatar
                                        address={user.address}
                                    ></AddressAvatar>
                                </RadioUser>
                            ))}
                        </RadioGroup>

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
                        {errorMessage && <Text>{errorMessage}</Text>}
                        <Button
                            type="submit"
                            variant="primary"
                            variantSize="medium"
                            mt="$30"
                            onClick={onLogin}
                        >
                            Log In
                        </Button>
                        <ExternalLink href="#" mt="$30" variant="body1">
                            Waves.Exchange
                        </ExternalLink>
                    </>
                )}
            </Flex>
        </Box>
    );
};
