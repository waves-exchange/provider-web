import { CSSObject } from '@styled-system/css';
import { TInvokeScriptCallArgument } from '@waves/ts-types';
import { TLong } from '@waves/waves-js';
import { pseudoElemStyles, COLOR_MAP } from './styles';

export const getAttrStyles = (
    attrType: TInvokeScriptCallArgument<TLong>['type'],
    isLast: boolean
): CSSObject => ({
    variant: 'body2',
    fontFamily: 'Menlo-Regular',
    color: COLOR_MAP[attrType],
    ':after': !isLast ? { ...pseudoElemStyles, content: '", "' } : {},
});

const formatText = (text: string): string =>
    text.length > 5 ? `${text.slice(0, 4)}...` : text;

export const getAttrContent = (
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
