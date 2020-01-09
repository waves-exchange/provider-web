import { IState } from '../interface';

export default function(state: IState) {
    return (): void => {
        if (state.user != null) {
            state.user = null;
        }
    };
}
