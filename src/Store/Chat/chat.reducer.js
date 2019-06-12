import { AUTH_ACTIONS } from '../Auth';

const ACTIONS = Object.freeze({
    MESSAGE_SENT: 'MESSAGE_SENT',
    MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
    JOIN_ROOM_REQUEST: AUTH_ACTIONS.JOIN_ROOM_REQUEST,
    JOIN_ROOM_SUCCESS: AUTH_ACTIONS.JOIN_ROOM_SUCCESS,
    UPDATE_ROOMS_LIST: 'UPDATE_ROOMS_LIST',
    UPDATE_ROOMS_LIST_REQUEST: 'UPDATE_ROOMS_LIST_REQUEST',
    LOG_OUT: AUTH_ACTIONS.LOG_OUT
});

const initialState = {
    messages: [],
    rooms: []
};

function reducer(state=initialState, { type, data }) {
    switch(type){
        case ACTIONS.MESSAGE_SENT:
            return state;

        case ACTIONS.MESSAGE_RECEIVED:
            return {
                ...state,
                messages: [
                    ...state.messages,
                    {
                        ...data
                    }
                ]
            };

        case ACTIONS.UPDATE_ROOMS_LIST:
            return {
                ...state,
                rooms: data
            };

        case ACTIONS.JOIN_ROOM_SUCCESS:
            return {
                ...state,
                messages:[]
            };

        case ACTIONS.LOG_OUT:
            return initialState;

        default:
            return state;
    }
}

export {
    reducer,
    ACTIONS
};