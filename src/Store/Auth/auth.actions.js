import { ACTIONS } from './auth.reducer';
import { SOCKET_ACTIONS } from '../SocketMiddleware';

function setupListeners() {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: ACTIONS.CHECK_USER_AVAILABLE_RESPONSE
        });
    }
}

function checkUserAvailable(user) {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.EMIT,
            event: ACTIONS.CHECK_USER_AVAILABLE_REQUEST,
            data: user
        });
    };
}

function logout() {
    return dispatch => {
        dispatch({
            type: SOCKET_ACTIONS.EMIT,
            event: ACTIONS.LOG_OUT,
        });
    };
}

function createUser({ user, model }) {
    return dispatch => {
        // update the model to loading
        dispatch({
            type: SOCKET_ACTIONS.EMIT,
            event: ACTIONS.CREATE_USER_REQUEST,
            data: user
        });

        model.setState(model.STATES.LOADING);
    };
}

function joinRoom(room) {
    return dispatch => {
        return dispatch({
            type: SOCKET_ACTIONS.EMIT,
            event: ACTIONS.JOIN_ROOM_REQUEST,
            data: room
        });
    };
}


export {
    setupListeners,
    checkUserAvailable,
    createUser,
    joinRoom,
    logout
}