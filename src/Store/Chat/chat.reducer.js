import { SOCKET_ACTIONS } from '../SocketMiddleware';
const ACTIONS = Object.freeze({
    MESSAGE: 'MESSAGE'
});

const initialState = {
    general: []
}

function reducer(state=initialState, { type, event, data }) {
    switch(type){
        case SOCKET_ACTIONS.EVENT_RECEIVED:
            switch (event) {
                case 'message':
                    return {
                        ...state,
                        general: [
                            ...state.general,
                            {
                                ...data
                            }
                        ]
                    };
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