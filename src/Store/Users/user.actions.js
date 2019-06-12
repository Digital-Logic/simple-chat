import { ACTIONS } from './user.reducer';
import { SOCKET_ACTIONS } from '../SocketMiddleware';

function subscribeUserList() {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: ACTIONS.UPDATE_USER_LIST
        });
    };
}

function unsubscribeUserList(handle){
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.UNSUBSCRIBE,
            event: ACTIONS.UPDATE_USER_LIST,
            handle
        });
    };
}



export {
    subscribeUserList,
    unsubscribeUserList
};