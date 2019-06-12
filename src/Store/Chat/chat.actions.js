import { ACTIONS } from './chat.reducer';
import { SOCKET_ACTIONS } from '../SocketMiddleware';

function subscribeToChat() {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: ACTIONS.MESSAGE_RECEIVED
        });
    };
}

function unsubscribeToChat(handle) {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.UNSUBSCRIBE,
            event: ACTIONS.MESSAGE_RECEIVED,
            handle
        });
    };
}


function createMessage(message) {
    return dispatch => {
        dispatch({
            type: SOCKET_ACTIONS.EMIT,
            event: ACTIONS.MESSAGE_SENT,
            data: {
                message
            }
        });
    };
}


export {
    createMessage,
    subscribeToChat,
    unsubscribeToChat
};