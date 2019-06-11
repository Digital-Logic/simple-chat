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

function unsubscribeUserList(handler){
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.UNSUBSCRIBE,
            event: ACTIONS.UPDATE_USER_LIST,
            handler
        });
    };
}



export {
    subscribeUserList,
    unsubscribeUserList
};