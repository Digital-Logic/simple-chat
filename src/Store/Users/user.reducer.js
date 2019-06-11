import { SOCKET_ACTIONS } from '../SocketMiddleware';
const ACTIONS = Object.freeze({
    ADD_USER_REQUEST: 'ADD_USER_REQUEST',
    ADD_USER_SUCCESSFUL: 'ADD_USER_SUCCESSFUL',
    ADD_USER_FAILURE: 'ADD_USER_FAILURE'
});

const initialState = {};


function reducer(state=initialState, { type, user, event, data }) {
    switch(type) {

        case SOCKET_ACTIONS.EVENT_RECEIVED:
            switch(event) {
                case 'update_user_list':
                    return data.reduce((acc, user) => {
                        acc[user] = {};
                        return acc;
                    },{})
                default:
                    return state;
            }

        default:
            return state;
    }
}

export {
    reducer,
    ACTIONS
};