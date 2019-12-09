import React = require('react');
import { Flex } from '@waves/react-uikit';
import { withTheme } from 'emotion-theming';
import { TDefaultTheme } from '@waves/react-uikit/dist/typings/interface';


export const Modal = withTheme((({ children, theme }) => (
    <Flex padding="46px"
        borderRadius="6px"
        width="520px"
        background={theme.colors.main.$900}
        flexDirection="column"
        position="relative">{children}</Flex>
)) as React.FC<{ theme: TDefaultTheme }>); 
