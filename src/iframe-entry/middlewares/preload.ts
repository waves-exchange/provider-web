import React from 'react';
import renderPage from '../utils/renderPage';
import Preload from '../pages/Preload';
import pipe from 'ramda/es/pipe';
import nthArg from 'ramda/es/nthArg';
import tap from 'ramda/es/tap';
import apply from 'ramda/es/apply';
import flip from 'ramda/es/flip';
import { TMiddleware } from '../utils/middleware';

const preload = (): void => {
    renderPage(React.createElement(Preload));
};

export const preloadMW: TMiddleware<unknown, void, unknown> = pipe(
    nthArg(3),
    tap(preload),
    flip(apply)([])
);
