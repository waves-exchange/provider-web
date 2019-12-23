import React, { FC } from 'react';
import { TInvokeScriptCallArgument } from '@waves/ts-types';
import { TLong } from '@waves/waves-js';
import { Text, Flex } from '@waves.exchange/react-uikit';

const PSEUDO_ELEMENTS_STYLE = {
    color: '#d4d4d4',
    fontSize: '$13',
    lineHeight: '$18',
    fontFamily: 'Menlo-Regular',
    display: 'inline',
};
const WRAP_ARGS_STYLE = {
    ':before': {
        ...PSEUDO_ELEMENTS_STYLE,
        content: '"("',
    },
};

const WRAP_END_ARGS_STYLE = {
    ':after': {
        ...PSEUDO_ELEMENTS_STYLE,
        content: '")"',
    },
};
const COLOR_MAP = {
    integer: '#b5cea9',
    string: '#cf9178',
    binary: '#cf9178',
    boolean: '#579cd6',
};

const formatText = (text: string): string =>
    text.length > 5 ? `${text.slice(0, 4)}...` : text;

const getAttrs = (
    index: number,
    color: string
): { key: number; variant: 'body2'; fontFamily: string; color: string } => ({
    key: index,
    variant: 'body2',
    fontFamily: 'Menlo-Regular',
    color,
});

const getContent = (
    type: TInvokeScriptCallArgument<TLong>['type'],
    value: TInvokeScriptCallArgument<TLong>['value']
): string | null => {
    switch (type) {
        case 'integer':
        case 'boolean':
            return String(value);
        case 'string':
            return `'${formatText(value as string)}'`;
        case 'binary':
            return 'base64:...';
        default:
            return null;
    }
};

const getFunctionArgumet = (
    item: TInvokeScriptCallArgument<TLong>,
    index: number,
    array: Array<TInvokeScriptCallArgument<TLong>>
): React.ReactElement | null => {
    const isNotLast = index < array.length - 1;
    // НЕРАЗРЫВНЫЙ ПРОБЕЛ В content
    // eslint-disable-next-line no-irregular-whitespace
    const style = { ...PSEUDO_ELEMENTS_STYLE, content: '", "' };

    return (
        <Text
            sx={{ ':after': isNotLast ? style : {} }}
            {...getAttrs(index, COLOR_MAP[item.type])}
        >
            {getContent(item.type, item.value)}
        </Text>
    );
};

export const InvokeFunction: FC<IProps> = ({ args, name }) => (
    <Flex sx={WRAP_END_ARGS_STYLE}>
        <Text isTruncated>
            <Text {...PSEUDO_ELEMENTS_STYLE}>{name}</Text>
            <Text sx={WRAP_ARGS_STYLE}>{args.map(getFunctionArgumet)}</Text>
        </Text>
    </Flex>
);

interface IProps {
    name: string;
    args: Array<TInvokeScriptCallArgument<TLong>>;
}
