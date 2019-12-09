import { IState } from '../index';

export default function(state: IState) {
    return () => {
        if (state.user != null) {
            return (state.user = null);
        }
    };
}
