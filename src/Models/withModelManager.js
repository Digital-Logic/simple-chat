import React, { createContext, useReducer, Fragment, useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Progress from '../UI/Progress';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const ModelContext = createContext();

const ACTIONS = Object.freeze({
    SET_STATE: 'SET_STATE',
    CREATE_MODEL: 'CREATE_MODEL'
});


const MODEL_STATES = Object.freeze({
    CLOSED: 'CLOSED',
    LOADING: 'LOADING',
});

function withModelManager(WrappedComponent) {

    const initialState = {
        state: MODEL_STATES.CLOSED,
        displayState: MODEL_STATES.LOADING,
        closeHandlers: {
            default: ({state, setState}) => {
                if (state !== MODEL_STATES.LOADING)
                    setState(MODEL_STATES.CLOSED);
            }
        },
        models: {
            [MODEL_STATES.CLOSED]: null,
            // Generic loading model
            [MODEL_STATES.LOADING]: ({state, onClose}) => (
                <Fragment>
                    <DialogTitle align="center">Loading</DialogTitle>
                    <DialogContent>
                        <Progress />
                    </DialogContent>
                    <DialogActions>
                        <Grid container justify="flex-end">
                            <Button
                                onClick={onClose}
                                disabled={state === 'LOADING'}>Close</Button>
                        </Grid>
                    </DialogActions>
                </Fragment>
            )
        },
    };

    function WithModelManager(props) {

        const [{ state, displayState, models, closeHandlers }, dispatch] = useReducer(reducer, initialState);

        const contextValue = {
            state,
            setState: state => dispatch(setState(state)),
            createModel: (props) => dispatch(createModel(props))
        };

        const onClose = useCallback(() => {
            typeof closeHandlers[displayState] === 'function' ?
                closeHandlers[displayState]({ state: displayState, setState: state => dispatch(setState(state)) }) :
                closeHandlers.default({ state: displayState, setState: state => dispatch(setState(state))});
        },[displayState, closeHandlers]);

        return (
            <ModelContext.Provider value={contextValue}>
                <WrappedComponent {...props} />

                <Dialog
                    open={state !== MODEL_STATES.CLOSED}
                    onClose={onClose}>
                {
                    models[displayState]({ state: displayState, onClose })
                }
                </Dialog>
            </ModelContext.Provider>
        );
    }

    return WithModelManager;
}

function reducer(state, { type, newState, key, model, onClose }) {
    switch(type) {
        case ACTIONS.SET_STATE:
            // Check if the requested state exist
            if (Object.keys(state.models).indexOf(newState) === -1)
                throw new Error('WithModelManager: request to change to an invalid state.');

            return {
                ...state,
                state: newState,
                displayState: newState === MODEL_STATES.CLOSED ? state.displayState : newState
            };

        case ACTIONS.CREATE_MODEL:
            return {
                ...state,
                models: {
                    ...state.models,
                    [key]: model
                },
                closeHandlers: {
                    ...state.closeHandlers,
                    [key]: onClose
                }
            };
        default:
            return state;
    }
}


function createModel({ key, model, onClose }) {
    return {
        type: ACTIONS.CREATE_MODEL,
        key,
        model,
        onClose
    };
}

function setState(state) {
    return {
        type: ACTIONS.SET_STATE,
        newState: state
    };
}

export default withModelManager;

export {
    ModelContext,
    MODEL_STATES
};