import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { socketMiddleware } from './SocketMiddleware';
import thunk from 'redux-thunk';

import { themeReducer } from './Theme';
import { userReducer } from './Users';
import { authReducer } from './Auth';
import { chatReducer } from './Chat';

const rootReducer = combineReducers({
    auth: authReducer,
    theme: themeReducer,
    users: userReducer,
    chat: chatReducer,
});

const Store = createStore(rootReducer,
    compose(
        applyMiddleware(socketMiddleware(), thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    ));

export {
    Store
};