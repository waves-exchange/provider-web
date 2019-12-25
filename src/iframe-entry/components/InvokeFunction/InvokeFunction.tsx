import React, { FC } from 'react';
import { TInvokeScriptCallArgument } from '@waves/ts-types';
import { TLong } from '@waves/signer';
import { Text, Flex, TFlexProps } from '@waves.exchange/react-uikit';
import { getAttrStyles, getAttrContent } from './helpers';
import {
    wrapperStylesEnd,
    wrapperStylesStart,
    pseudoElemStyles,
} from './styles';

interface IProps {
    name: string;
    args: Array<TInvokeScriptCallArgument<TLong>>;
}
export const InvokeFunction: FC<IProps & TFlexProps> = ({
    args,
    name,
    ...rest
}) => (
    <Flex sx={wrapperStylesEnd} fontSize="$13" lineHeight="$18" {...rest}>
        <Text isTruncated>
            <Text sx={pseudoElemStyles}>{name}</Text>
            <Text sx={wrapperStylesStart}>
                {args.map(({ type, value }, index) => (
                    <Text sx={getAttrStyles(type, index === args.length - 1)}>
                        {getAttrContent(type, value)}
                    </Text>
                ))}
            </Text>
        </Text>
    </Flex>
);
