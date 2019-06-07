import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import applyTheme from './applyTheme';
import AppBar from './Components/AppBar';

function App() {

    useEffect(() => {

    }, []);

    return (
        <div>
            <AppBar />
        </div>
    );
}

function mapDispatch(dispatch) {
    return {

    };
}

function mapState(state) {
    return {

    };
}

export default compose(
    connect(mapState, mapDispatch),
    applyTheme,
)(App);
