import React, { FC } from 'react';
import { Global } from '@emotion/core';
import Roboto from '../../fonts/roboto7.woff2';
import RobotoLight from '../../fonts/roboto-light7.woff2';
import RobotoMedium from '../../fonts/roboto-medium7.woff2';

export const GlobalCSS: FC = () => {
    return (
        <Global
            styles={[
                {
                    '@font-face': {
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: 300,
                        fontDisplay: 'swap',
                        src: `url(${RobotoLight}) format("woff2")`,
                    },
                },
                {
                    '@font-face': {
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontDisplay: 'swap',
                        src: `url(${Roboto}) format("woff2")`,
                    },
                },
                {
                    '@font-face': {
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        fontDisplay: 'swap',
                        src: `url(${RobotoMedium}) format("woff2")`,
                    },
                },
                {
                    '*': {
                        boxSizing: 'border-box',
                    },
                    html: {
                        height: '100%',
                    },
                    body: {
                        fontFamily: 'Roboto, sans-serif',
                        margin: 0,
                        padding: 0,
                        minHeight: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        WebkitOverflowScrolling: 'touch',
                    },
                    '@supports (-webkit-touch-callout: none)': {
                        body: {
                            minHeight: '-webkit-fill-available',
                        },
                    },
                    button: {
                        fontFamily: 'Roboto, sans-serif',
                    },
                    '#root': {
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '520px',
                        minHeight: '100%',
                        maxHeight: ['100vh', 'initial'],
                    },
                    '#overlay': {
                        position: 'fixed',
                        zIndex: -1,
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        overflow: 'hidden',
                        backgroundColor: '#000',
                        opacity: 0.6,
                    },
                    '::-webkit-scrollbar-thumb': {
                        backgroundColor: '#495060',
                        borderRadius: '4px',
                    },
                    '::-webkit-scrollbar': {
                        width: '3px',
                        height: '3px',
                    },
                    '::-webkit-scrollbar-corner': {
                        opacity: 0,
                    },
                    '::-webkit-scrollbar-track-piece': {
                        marginBottom: '5px',
                        marginTop: '5px',
                    },
                    '::placeholder': {
                        color: '#959dae',
                    },
                },
            ]}
        />
    );
};
