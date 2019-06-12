import React, { createContext, useReducer, Fragment, useMemo } from 'react';
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


const MODEL_STATES = {
    CLOSED: 'CLOSED',
    LOADING: 'LOADING',
};


function withModelManager(_models=[]) {

    // const initialModelState = _models.reduce((collector, { model, actions, key }) => {

    // },{
    //     [MODEL_STATES.CLOSED]: null,
    // });

    function _withModelManager(WrappedComponent) {

        const initialState = {
            state: MODEL_STATES.CLOSED,
            displayState: MODEL_STATES.LOADING,
            actions: {
                default:{
                    onClose:({state, setState}) => {
                        if (state !== MODEL_STATES.LOADING) {
                            setState(MODEL_STATES.CLOSED);
                        }
                    }
                },
                [MODEL_STATES.LOADING]: {
                    onClose:({state, setState}) => {
                        if (state !== MODEL_STATES.LOADING)
                            setState(MODEL_STATES.CLOSED);
                    }
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
                ),
            },
        };

        function WithModelManager(props) {

            const [{ state, displayState, models, actions }, dispatch] = useReducer(reducer, initialState);

            const contextValue = {
                state,
                setState: state => dispatch(setState(state)),
                createModel: (props) => dispatch(createModel(props)),
                STATES: MODEL_STATES
            };

            // Each function defined in this models actions, will be provided with state and setState properties
            // by wrapping these properties with a closure and memorizing them
            const modelActions = useMemo(() => Object.entries(actions[displayState]).reduce((acc, [key, fun]) => {
                acc[key] = (data) => fun({
                    state: displayState,
                    setState: state => dispatch(setState(state)),
                    ...data
                });

                return acc;
            },{}), [displayState, actions]);

            return (
                <ModelContext.Provider value={contextValue}>
                    <WrappedComponent {...props} />

                    <Dialog
                        open={state !== MODEL_STATES.CLOSED}
                        onClose={ modelActions.onClose }>
                    {
                        models[displayState]({
                            state: displayState,
                            actions: modelActions,
                            onClose: modelActions.onClose
                        })
                    }
                    </Dialog>
                </ModelContext.Provider>
            );
        }

        return WithModelManager;
    }
    return _withModelManager;
}



function reducer(state, { type, newState, key, model, actions }) {
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
            MODEL_STATES[key] = key;
            return {
                ...state,
                models: {
                    ...state.models,
                    [key]: model
                },
                actions: {
                    ...state.actions,
                    [key]: {
                        ...actions,
                        onClose: typeof actions.onClose === 'function' ? actions.onClose :
                            state.actions.default.onClose
                    }
                }
            };
        default:
            return state;
    }
}


function createModel({ key, model, actions={} }) {
    return {
        type: ACTIONS.CREATE_MODEL,
        key,
        model,
        actions
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