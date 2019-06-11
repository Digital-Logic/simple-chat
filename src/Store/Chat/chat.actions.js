import { ACTIONS } from './chat.reducer';
import { SOCKET_ACTIONS } from '../SocketMiddleware';

function joinRoom(room='general') {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: 'message'
        });
    };
}


function createMessage(message, room='general') {
    return dispatch => {
        dispatch({
            type: SOCKET_ACTIONS.EMIT,
            event: 'message',
            data: {
                room,
                message
            }
        });
    };
}


export {
    createMessage,
    joinRoom
};