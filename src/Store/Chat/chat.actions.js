import { ACTIONS } from './chat.reducer';
import { SOCKET_ACTIONS } from '../SocketMiddleware';

function joinRoom(room='general') {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: ACTIONS.MESSAGE_RECEIVED
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
    joinRoom
};