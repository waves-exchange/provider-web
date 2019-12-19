import React, { FC } from 'react';
import { Global, css } from '@emotion/core';

export const GlobalCSS: FC = () => {
    return (
        <Global
            styles={css`
                @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap&subset=cyrillic');
                body {
                    font-family: 'Roboto', sans-serif;
                    margin: 0;
                    padding: 0;
                }
            `}
        />
    );
};
