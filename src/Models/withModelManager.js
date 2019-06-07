import React, { useContext, useReducer } from 'react';


function withModel(WrappedComponent) {

    const initialState = {};

    function reducer(state, { type }) {
        switch(type) {

        }
    }

    function WithModel() {

        const [state, dispatch] = useReducer(reducer, initialState);


    }

    const ACTIONS = Object.freeze({

    });

    return WithModel;
}

export default withModel;