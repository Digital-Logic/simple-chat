import React, { useEffect, useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { ModelContext } from '../Models/withModelManager';
import compose from 'recompose/compose';
import CreateRoom from '../Models/CreateRoom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { authActions, chatActions } from '../Store';
import RadioIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioCheckedIcon from '@material-ui/icons/RadioButtonChecked'
import Button from '@material-ui/core/Button';

const styles = theme => ({

});

function Rooms({ rooms, joinRoom, subscribeToJoinRoom, unsubscribeToJoinRoom, currentRoom,
        subscribeToUpdateRoomsList, unsubscribeToUpdateRoomsList, updateRoomsList }) {


    const { createModel, setState, STATES } = useContext(ModelContext);

    useEffect(() => {
        const joinRoomHandle = subscribeToJoinRoom();
        const roomUpdateHandle = subscribeToUpdateRoomsList();

        updateRoomsList(); // get rooms list from server


        // Create model CREATE_ROOM
        createModel({
            key: 'CREATE_ROOM',
            model: CreateRoom,
            actions: {
                onClose: () => {},
                onCancel: ({ setState, STATES }) => setState(STATES.CLOSED),
                onSubmit: ({ setState, STATES, room }) => {
                    joinRoom( room);
                    setState(STATES.CLOSED);
                }
            }
        });

        return () => {
            unsubscribeToJoinRoom(joinRoomHandle);
            unsubscribeToUpdateRoomsList(roomUpdateHandle);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <Grid container direction="column">
            <Paper elevation={5}>
                <List>
                    <Typography
                        variant="subtitle2"
                        align="center">Rooms</Typography>

                    {
                        rooms.map(room => (
                            <ListItem
                                key={room}
                                onClick={() => joinRoom(room)}
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
                <Button
                    onClick={() => setState(STATES.CREATE_ROOM)}
                    fullWidth>Create Room</Button>
            </Paper>
        </Grid>
    );
}

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