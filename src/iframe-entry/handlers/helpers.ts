import React from 'react';
import renderPage from '../utils/renderPage';
import Preload from '../pages/Preload';
import tap from 'ramda/es/tap';
import { IState } from '../interface';
import { IUser, IUserWithBalances } from '../../interface';
import { fetchWavesBalance, fetchAliasses } from '../services/userService';
import { Queue } from '../../utils/Queue';

const preloadFunc = (): void => {
    renderPage(React.createElement(Preload));
};

export const preload: IPreloadFunc = tap(preloadFunc) as any;

export const loadUserData = (
    state: IState<IUser>
): Promise<IState<IUserWithBalances>> =>
    Promise.all([
        fetchAliasses(state.nodeUrl, state.user.address),
        fetchWavesBalance(state.nodeUrl, state.user.address),
    ]).then(([aliases, balance]) => ({
        ...state,
        user: {
            ...state.user,
            aliases,
            balance,
        },
    }));

export const toQueue = <T extends (data?: any) => Promise<any>>(
    queue: Queue,
    handler: T
): ((data?: TParam<T>) => Promise<TReturn<T>>) => {
    return (data?: TParam<T>): Promise<TReturn<T>> => {
        const action = (): Promise<TReturn<T>> => {
            return handler(data);
        };

        if (queue.canPush()) {
            return queue.push(action);
        } else {
            return Promise.reject('Queue is full!');
        }
    };
};

type TParam<T> = T extends (data: infer PARAM) => Promise<any> ? PARAM : never;
type TReturn<T> = T extends (data: any) => Promise<infer RETURN>
    ? RETURN
    : never;

export interface IPreloadFunc {
    <T>(data: T): T;
    (): void;
}
