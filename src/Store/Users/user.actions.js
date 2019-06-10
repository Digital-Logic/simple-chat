import { ACTIONS } from './user.reducer';
import { SOCKET_ACTIONS } from '../SocketMiddleware';

function setupListeners() {
    return dispatch => {

        dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: 'user_list'
        });
    };
}




export {
    setupListeners
};