import { ACTIONS } from './user.reducer';
import { SOCKET_ACTIONS } from '../SocketMiddleware';

function subscribeUserList() {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: 'update_user_list'
        });
    };
}

function unsubscribeUserList(handler){
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.UNSUBSCRIBE,
            event: 'update_user_list',
            handler
        });
    };
}



export {
    subscribeUserList,
    unsubscribeUserList
};