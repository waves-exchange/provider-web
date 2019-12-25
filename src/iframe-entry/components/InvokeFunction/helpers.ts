import { CSSObject } from '@styled-system/css';
import { TInvokeScriptCallArgument } from '@waves/ts-types';
import { TLong } from '@waves/signer';
import { pseudoElemStyles, COLOR_MAP } from './styles';

export const getAttrStyles = (
    attrType: TInvokeScriptCallArgument<TLong>['type'],
    isLast: boolean
): CSSObject => ({
    variant: 'body2',
    fontFamily: 'Menlo, Monaco, Consolas, Courier New, monospace',
    color: COLOR_MAP[attrType],
    ':after': !isLast ? { ...pseudoElemStyles, content: '", "' } : {},
});

const formatText = (text: string | number): string =>
    String(text).length >= 5 ? `${String(text).slice(0, 4)}...` : String(text);

export const getAttrContent = (
    type: TInvokeScriptCallArgument<TLong>['type'],
    value: TInvokeScriptCallArgument<TLong>['value']
): string | null => {
    switch (type) {
        case 'integer':
            return formatText(value as string | number);
        case 'boolean':
            return String(value);
        case 'string':
            return `'${formatText(value as string)}'`;
        case 'binary':
            return "'base64:...'";
        default:
            return null;
    }
};
