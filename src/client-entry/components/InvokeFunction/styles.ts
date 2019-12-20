export const COLOR_MAP = {
    integer: '#b5cea9',
    string: '#cf9178',
    binary: '#cf9178',
    boolean: '#579cd6',
};

export const pseudoElemStyles = {
    color: '#d4d4d4',
    fontSize: '$13',
    lineHeight: '$18',
    fontFamily: 'Menlo-Regular',
    display: 'inline',
};

export const wrapperStylesStart = {
    ':before': {
        ...pseudoElemStyles,
        content: '"("',
    },
};

export const wrapperStylesEnd = {
    ':after': {
        ...pseudoElemStyles,
        content: '")"',
    },
};
