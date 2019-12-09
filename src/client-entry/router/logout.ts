import { IState } from '../index';


export default function (state: IState) {
    return () => {
        if (state.user) {
            return state.user = null;
        }
    };
}