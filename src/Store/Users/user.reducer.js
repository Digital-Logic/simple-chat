import { SOCKET_ACTIONS } from '../SocketMiddleware';
const ACTIONS = Object.freeze({
    ADD_USER_REQUEST: 'ADD_USER_REQUEST',
    ADD_USER_SUCCESSFUL: 'ADD_USER_SUCCESSFUL',
    ADD_USER_FAILURE: 'ADD_USER_FAILURE',
    UPDATE_USER_LIST: 'UPDATE_USER_LIST',
});

const initialState = {};


function reducer(state=initialState, { type, user, event, data }) {
    switch(type) {

        case ACTIONS.UPDATE_USER_LIST:
            return data.reduce((acc, user) => {
                acc[user] = {};
                return acc;
            },{})

        default:
            return state;
    }
}

export {
    reducer,
    ACTIONS
};