import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import applyTheme from './applyTheme';
import AppBar from './Components/AppBar';
import withModelManager, { ModelContext, MODEL_STATES } from './Models/withModelManager';
import NewUserModel from './Models/NewUserModel';
import { userActions, authActions, AUTH_ACTIONS } from './Store';
import { SOCKET_ACTIONS } from './Store/SocketMiddleware';

const ModelStates = {
    ...MODEL_STATES,
    NEW_USER: 'NEW_USER'
};

function App({ setupListeners, dispatch }) {

    const { state, setState, createModel, STATES } = useContext(ModelContext);

    useEffect(() => {
        createModel({
                key: ModelStates.NEW_USER,
                model: NewUserModel,
                actions: {
                    onClose: ({ state, setState }) => {
                        if (state !== ModelStates.LOADING && state !== ModelStates.NEW_USER)
                            setState(ModelStates.CLOSED);
                    }
                }
            });
        setState(ModelStates.NEW_USER);

        setupListeners();

        dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: 'user_created',
            handle: data => {
                setState(STATES.CLOSED);
                dispatch({
                    type: AUTH_ACTIONS.CREATE_USER_SUCCESS,
                    userHandle: data
                });
            }
        });

        dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: 'user_create_failed',
            handle: data => {
                dispatch({
                })
            }
        });

    },[]);

    return (
        <div>
            <AppBar />
        </div>
    );
}

function mapDispatch(dispatch) {
    return {
        setupListeners: () => {
            dispatch(userActions.setupListeners());
            dispatch(authActions.setupListeners());
        },
        dispatch
    };
}

function mapState(state) {
    return {

    };
}

export default compose(
    connect(mapState, mapDispatch),
    applyTheme,
    withModelManager(),
)(App);
