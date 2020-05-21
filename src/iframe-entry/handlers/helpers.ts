import React from 'react';
import renderPage from '../utils/renderPage';
import Preload from '../pages/Preload';
import { IState } from '../interface';
import { IUser, IUserWithBalances } from '../../interface';
import {
    fetchWavesBalance,
    fetchAliasses,
    fetchAddressHasScript,
} from '../services/userService';
import { Queue } from '../../utils/Queue';

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
