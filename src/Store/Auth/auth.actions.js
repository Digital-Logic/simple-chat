import { ACTIONS } from './auth.reducer';
import { SOCKET_ACTIONS } from '../SocketMiddleware';

function setupListeners() {
    return dispatch => {
        dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: 'user_exist'
        });
    }
}

function checkUserAvailable(user) {
    return dispatch => {
        dispatch({
            type: SOCKET_ACTIONS.EMIT,
            event: 'user_exist',
            data: user
        });
    };
}

function logout() {
    return {
        type: ACTIONS.LOG_OUT
    };
}

function createUser({ user, model }) {
    return dispatch => {
        // update the model to loading
        dispatch({
            type: ACTIONS.CREATE_USER_REQUEST,
            user
        });

        dispatch({
            type: SOCKET_ACTIONS.EMIT,
            event: 'create_user',
            data: user
        });

        model.setState(model.STATES.LOADING);
    };
}


export {
    setupListeners,
    checkUserAvailable,
    createUser,
    logout
}