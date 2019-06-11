import { SOCKET_ACTIONS } from '../SocketMiddleware';
const ACTIONS = Object.freeze({
    MESSAGE_SENT: 'MESSAGE_SENT',
    MESSAGE_RECEIVED: 'MESSAGE_RECEIVED'
});

const initialState = [];

function reducer(state=initialState, { type, data }) {
    switch(type){
        case ACTIONS.MESSAGE_SENT:
            return state;

        case ACTIONS.MESSAGE_RECEIVED:
            return [
                ...state,
                {
                    ...data
                }
            ];

        default:
            return state;
    }
}

export {
    reducer,
    ACTIONS
};