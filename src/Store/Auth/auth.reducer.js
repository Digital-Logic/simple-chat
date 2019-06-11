import { SOCKET_ACTIONS } from '../SocketMiddleware';

const ACTIONS = Object.freeze({
    CREATE_USER_REQUEST: 'CREATE_USER_REQUEST',
    CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
    CREATE_USER_FAILURE: 'CREATE_USER_FAILURE',
    USER_ALREADY_EXIST: 'USER_ALREADY_EXIST',
    CHECK_USER_AVAILABLE_REQUEST: 'CHECK_USER_AVAILABLE_REQUEST',
    CHECK_USER_AVAILABLE_RESPONSE: 'CHECK_USER_AVAILABLE_RESPONSE',
    LOG_OUT: 'LOG_OUT'
});

const initialState = {
    isAuthenticating: false,
    isAuthenticated: false,
    userHandle: null,
    availableHandles: {}
}

function reducer(state=initialState, { type, event, data, userHandle, error }) {
    switch(type) {

        case ACTIONS.CREATE_USER_REQUEST:
            return {
                ...state,
                isAuthenticating: true,
                isAuthenticated: false
            };

        case ACTIONS.CREATE_USER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                isAuthenticating: false,
                userHandle,
                availableHandles:{}
            };

        case ACTIONS.CREATE_USER_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                isAuthenticating: false,
                userHandle: null,
                availableHandles: {
                    availableHandles: {
                        ...state.availableHandles,
                        [userHandle]: {
                            ...state.availableHandles[userHandle],
                            isAvailable: false
                        }
                    }
                }
            }

        case ACTIONS.LOG_OUT:
            return initialState;

        case ACTIONS.CHECK_USER_AVAILABLE_REQUEST:
            return {
                ...state,
                availableHandles: {
                    ...state.availableHandles,
                    [data]: {
                        ...state.availableHandles[data],
                        checkingAvailable: !(state.availableHandles[data] &&
                            state.availableHandles[data].checkedAt > Date.now() - 50000)
                    }
                }
            };

        case ACTIONS.CHECK_USER_AVAILABLE_RESPONSE:
            return {
                ...state,
                availableHandles: {
                    ...state.availableHandles,
                    ...Object.entries(data).reduce((acc, [key, value]) => {
                        acc[key] = {
                            isValidating: false,
                            available: value,
                            checkedAt: Date.now()
                        };
                        return acc;
                    },{})
                }
            };
        default:
            return state;
    }
}

export {
    reducer,
    ACTIONS
};