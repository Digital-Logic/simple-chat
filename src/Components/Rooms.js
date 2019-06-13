import React, { useEffect, useContext, useCallback } from 'react';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { ModelContext } from '../Models/withModelManager';
import compose from 'recompose/compose';
import CreateRoom from '../Models/CreateRoom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { authActions, chatActions } from '../Store';
import RadioIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioCheckedIcon from '@material-ui/icons/RadioButtonChecked'
import Button from '@material-ui/core/Button';
import ScrollPaper from './ScrollPaper';
import PropTypes from 'prop-types';

const styles = theme => ({
    paper: {
        display: 'flex',
        flexDirection: 'column'
    },
    listContainer: {
        flexGrow: 1,
        position: 'relative'
    },
    list: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        overflow: 'auto',
        overflowX: 'hidden'
    }
});

function Rooms({ rooms, joinRoom, subscribeToJoinRoom, unsubscribeToJoinRoom, currentRoom,
        subscribeToUpdateRoomsList, unsubscribeToUpdateRoomsList, updateRoomsList, classes }) {


    const { createModel, setState, STATES } = useContext(ModelContext);

    useEffect(() => {
        const joinRoomHandle = subscribeToJoinRoom();
        const roomUpdateHandle = subscribeToUpdateRoomsList();

        joinRoom('general');
        updateRoomsList(); // get rooms list from server
        return () => {
            unsubscribeToJoinRoom(joinRoomHandle);
            unsubscribeToUpdateRoomsList(roomUpdateHandle);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const onJoinRoom = useCallback(room => {
        if (currentRoom.toLowerCase() !== room.toLowerCase())
             joinRoom(room);
     },[currentRoom, joinRoom]);

    useEffect(() => {
        // Create model CREATE_ROOM
        createModel({
            key: 'CREATE_ROOM',
            model: CreateRoom,
            actions: {
                onClose: () => {},
                onCancel: ({ setState, STATES }) => setState(STATES.CLOSED),
                onSubmit: ({ setState, STATES, room }) => {
                    onJoinRoom(room);
                    setState(STATES.CLOSED);
                }
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[onJoinRoom]);

    return (
        <ScrollPaper className={classes.paper}>
            <div className={classes.listContainer}>
                <List className={classes.list}>
                    <Typography
                        variant="subtitle2"
                        align="center">Chat Rooms</Typography>

                    {
                        rooms.map(room => (
                            <ListItem
                                key={room}
                                onClick={() => onJoinRoom(room)}
                                button>
                                <ListItemIcon>
                                {
                                    room === currentRoom ? <RadioCheckedIcon /> : <RadioIcon />
                                }
                                </ListItemIcon>
                                <ListItemText>{ room.split(' ')
                                    .map( word => word[0].toUpperCase() + word.slice(1))
                                    .join(' ') }</ListItemText>
                            </ListItem>
                        ))
                    }
                </List>
            </div>
            <Button
                onClick={() => setState(STATES.CREATE_ROOM)}
                fullWidth>Create Room</Button>
        </ScrollPaper>
    );
}

Rooms.propTypes = {
    classes: PropTypes.object.isRequired
};

function mapDispatch(dispatch) {
    return {
        joinRoom: room => dispatch(authActions.joinRoom(room)),
        updateRoomsList: () => dispatch(chatActions.updateRoomsList()),
        subscribeToJoinRoom: () => dispatch(chatActions.subscribeToJoinRoom()),
        unsubscribeToJoinRoom: handle => dispatch(chatActions.unsubscribeToJoinRoom(handle)),
        subscribeToUpdateRoomsList: () => dispatch(chatActions.subscribeToUpdateRoomsList()),
        unsubscribeToUpdateRoomsList: handle => dispatch(chatActions.unsubscribeToUpdateRoomsList(handle)),
    };
}

function mapState(state) {
    return {
        rooms: state.chat.rooms,
        currentRoom: state.auth.room
    };
}

export default compose(
    withStyles(styles),
    connect(mapState, mapDispatch)
)(Rooms);