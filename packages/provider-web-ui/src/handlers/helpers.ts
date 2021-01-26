import React from 'react';
import { IUser, IUserWithBalances } from '../interface';
import { IQueue } from '../utils/Queue';
import { IState } from '../interface';
import Preload from '../pages/Preload';
import {
    fetchAddressHasScript,
    fetchAliasses,
    fetchWavesBalance,
} from '../services/userService';
import renderPage from '../utils/renderPage';

export const preload = (): void => {
    renderPage(React.createElement(Preload));
};

export const loadUserData = (
    state: IState<IUser>
): Promise<IState<IUserWithBalances>> =>
    Promise.all([
        fetchAliasses(state.nodeUrl, state.user.address),
        fetchWavesBalance(state.nodeUrl, state.user.address),
        fetchAddressHasScript(state.nodeUrl, state.user.address),
    ]).then(([aliases, balance, hasScript]) => ({
        ...state,
        user: {
            ...state.user,
            aliases,
            balance,
            hasScript,
        },
    }));

export const toQueue = <T extends (data?: any) => Promise<any>>(
    queue: IQueue,
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
