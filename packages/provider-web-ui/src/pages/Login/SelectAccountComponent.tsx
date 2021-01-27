import {
    AddressAvatar,
    Button,
    RadioButtonGroup,
    RadioButtonProps,
    Flex,
    Box,
    Icon,
    iconCheck,
    AddressLabel,
} from '@waves.exchange/react-uikit';
import React, { useEffect, FC, MouseEventHandler } from 'react';
import { IUser } from '../../interface';
import { getUserName, StorageUser } from '../../services/userService';
import { libs } from '@waves/waves-transactions';
import { analytics } from '../../utils/analytics';

const RadioUser: FC<RadioButtonProps<IUser>> = ({
    children,
    checked,
    value: _value,
    as: _as, // Types difference in react 16 vs 17 - added slot in ElementType
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

type SelectAccountProps = {
    users?: StorageUser[];
    currentUser?: StorageUser;
    networkByte: number;
    onUserChange: (value: StorageUser) => void;
    onContinue: MouseEventHandler<HTMLButtonElement>;
};

export const SelectAccountComponent: FC<SelectAccountProps> = ({
    users = [],
    currentUser,
    networkByte,
    onUserChange,
    onContinue,
}) => {
    useEffect(() => {
        analytics.send({
            name: 'Select_Account_Page_Show',
        });
    }, []);

    return (
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
                        <AddressLabel
                            address={user.address}
                            name={getUserName(
                                networkByte,
                                libs.crypto.publicKey({
                                    privateKey: user.privateKey,
                                })
                            )}
                        >
                            <AddressAvatar address={user.address} />
                        </AddressLabel>
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
                Continue
            </Button>
        </>
    );
};
