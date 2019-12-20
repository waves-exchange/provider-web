import React, { FC } from 'react';
import { Global, css } from '@emotion/core';

export const GlobalCSS: FC = () => {
    return (
        <Global
            styles={css`
                @import url('/iframe-entry/fonts/roboto7.woff2');
                @import url('/iframe-entry/fonts/roboto-medium7.woff2');
                @import url('/iframe-entry/fonts/roboto-light7.woff2');
                body {
                    font-family: 'Roboto', sans-serif;
                    margin: 0;
                    padding: 0;
                }
            `}
        />
    );
};
