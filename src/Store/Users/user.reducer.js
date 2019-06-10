import { SOCKET_ACTIONS } from '../SocketMiddleware';
const ACTIONS = Object.freeze({
    ADD_USER_REQUEST: 'ADD_USER_REQUEST',
    ADD_USER_SUCCESSFUL: 'ADD_USER_SUCCESSFUL',
    ADD_USER_FAILURE: 'ADD_USER_FAILURE'
});

const initialState = {
};


function reducer(state=initialState, { type, user, event, data }) {
    switch(type) {

        default:
            return state;
    }
}

export {
    reducer,
    ACTIONS
};