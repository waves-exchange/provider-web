import React, { FC } from 'react';
import { TInvokeScriptCallArgument } from '@waves/ts-types';
import { TLong } from '@waves/waves-js';
import { Text, Flex } from '@waves.exchange/react-uikit';
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
export const InvokeFunction: FC<IProps> = ({ args, name }) => (
    <Flex sx={wrapperStylesEnd}>
        <Text isTruncated>
            <Text sx={pseudoElemStyles}>{name}</Text>
            <Text sx={wrapperStylesStart}>
                {args.map(({ type, value }, index) => (
                    <Text sx={getAttrStyles(type, index >= args.length)}>
                        {getAttrContent(type, value)}
                    </Text>
                ))}
            </Text>
        </Text>
    </Flex>
);
