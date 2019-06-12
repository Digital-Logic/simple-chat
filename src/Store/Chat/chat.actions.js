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

function subscribeToJoinRoom() {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: ACTIONS.JOIN_ROOM_SUCCESS
        });
    };
}

function unsubscribeToJoinRoom(handle) {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.UNSUBSCRIBE,
            handle
        });
    };
}

function subscribeToUpdateRoomsList() {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: ACTIONS.UPDATE_ROOMS_LIST
        });
    };
}

function unsubscribeToUpdateRoomsList(handle) {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.UNSUBSCRIBE,
            handle
        });
    };
}

function updateRoomsList() {
    return dispatch => {
        dispatch({
            type: SOCKET_ACTIONS.EMIT,
            event: ACTIONS.UPDATE_ROOMS_LIST_REQUEST
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
    updateRoomsList,
    subscribeToChat,
    unsubscribeToChat,
    subscribeToJoinRoom,
    unsubscribeToJoinRoom,
    subscribeToUpdateRoomsList,
    unsubscribeToUpdateRoomsList
};