import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import applyTheme from './applyTheme';
import AppBar from './Components/AppBar';
import withModelManager, { ModelContext, MODEL_STATES } from './Models/withModelManager';
import NewUserModel from './Models/NewUserModel';
import { authActions, AUTH_ACTIONS, chatActions, themeActions } from './Store';
import { SOCKET_ACTIONS } from './Store/SocketMiddleware';
import UserList from './Components/UserList';
import Grid from '@material-ui/core/Grid';
import Chat from './Components/Chat';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Rooms from './Components/Rooms';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const ModelStates = {
    ...MODEL_STATES,
    NEW_USER: 'NEW_USER'
};

const styles = theme => ({
    appBarSpacer: {
        width: '100%',
        marginBottom: '20px',
        ...theme.mixins.toolbar
    },
    container: {
        height: '100vh',
        maxWidth: 1000,
        marginLeft: 'auto',
        marginRight: 'auto',
        overflow: 'hidden'
    },
    chatContainer: {
        padding: 8,
        margin: 0,
        width: '100%',
        height: '100%'
    },
    chatWindow: {
    },
    userWindow: {
    },
    footer: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '30px',
        backgroundColor: theme.palette.primary.dark,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        color: theme.palette.getContrastText(theme.palette.primary.dark),
        '& > span': {
            display: 'flex',
            alignItems: 'center',
        },
        '& a': {
            color: theme.palette.getContrastText(theme.palette.primary.dark),
        }
    },
    footerSpacer: {
        height: '30px'
    }
});


function App({ setupListeners, isAuthenticated, dispatch,  subscribeToChat, unsubscribeToChat,
        classes, sendMessage, messages, themeStyle, toggleTheme, logout, }) {

    // eslint-disable-next-line no-unused-vars
    const { state, setState, createModel, STATES } = useContext(ModelContext);

    useEffect(() => {
        createModel({
                key: ModelStates.NEW_USER,
                model: NewUserModel,
                actions: {
                    onClose: ({ state, setState, STATES }) => {
                        console.log(STATES);
                        if (state !== STATES.LOADING && state !== STATES.NEW_USER)
                            setState(STATES.CLOSED);
                    }
                }
            });
        /**
         * Subscribe to Socket.io listeners
         */
        setupListeners();

        dispatch({
            type: SOCKET_ACTIONS.SUBSCRIBE,
            event: AUTH_ACTIONS.CREATE_USER_SUCCESS,
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
            event: AUTH_ACTIONS.CREATE_USER_FAILURE,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {
        if (!isAuthenticated)
        {
            setState(ModelStates.NEW_USER);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAuthenticated]);

    return (
        <div>
            <AppBar
                logout={logout}
                isAuthenticated={isAuthenticated}
                themeStyle={themeStyle}
                toggleTheme={toggleTheme} />
            {
                isAuthenticated ? (
                    <Grid container direction="column" wrap="nowrap" className={classes.container}>
                        <div className={classes.appBarSpacer} />
                        <Grid container spacing={4} className={classes.chatContainer}>
                            <Grid item xs={8}>
                                <Chat
                                    className={classes.chatWindow}
                                    sendMessage={sendMessage}
                                    messages={messages}
                                    subscribeToChat={subscribeToChat}
                                    unsubscribeToChat={unsubscribeToChat}/>
                            </Grid>
                            <Grid container item xs={4} spacing={4} direction="column">
                                <Grid item style={{ height: '50%'}}>
                                    <UserList className={classes.userWindow} />
                                </Grid>
                                <Grid item style={{ height: '50%'}}>
                                    <Rooms />
                                </Grid>
                            </Grid>
                        </Grid>
                        <div className={classes.footerSpacer} />
                    </Grid>
                ): null
            }
            <div className={classes.footer}>
                <Typography variant="subtitle2">Source: <Button href="https://github.com/Digital-Logic/simple-chat" target="_blank" size="small">Github.com</Button></Typography>
                <Button href="https://digital-logic.net/" target="_blank" size="small">digital-logic.net</Button>
            </div>
        </div>
    );
}

App.propTypes = {
    classes: PropTypes.object.isRequired
};

function mapDispatch(dispatch) {
    return {
        setupListeners: () => dispatch(authActions.setupListeners()),
        logout: () => dispatch(authActions.logout()),
        sendMessage: message => dispatch(chatActions.createMessage(message)),
        subscribeToChat: () => dispatch(chatActions.subscribeToChat()),
        unsubscribeToChat: (handle) => dispatch(chatActions.unsubscribeToChat(handle)),
        toggleTheme: () => dispatch(themeActions.switchTheme()),
        dispatch
    };
}

function mapState(state) {
    return {
       isAuthenticated: state.auth.isAuthenticated,
       messages: state.chat.messages,
       rooms: state.chat.rooms,
       themeStyle: state.theme.style,
    };
}

export default compose(
    connect(mapState, mapDispatch),
    applyTheme,
    withStyles(styles),
    withModelManager(),
)(App);
