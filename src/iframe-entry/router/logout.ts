import { IState } from '../interface';

export default function(state: IState) {
    return () => {
        if (state.user != null) {
            return (state.user = null);
        }
    };
}
