import { AUTH_ACTIONS } from '../Auth';

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

        case AUTH_ACTIONS.LOG_OUT:
            return initialState;

        default:
            return state;
    }
}

export {
    reducer,
    ACTIONS
};