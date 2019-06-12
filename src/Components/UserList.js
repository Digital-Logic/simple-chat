import React, { PureComponent } from 'react';
import Paper from '@material-ui/core/Paper';
import compose from 'recompose/compose';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { userActions } from '../Store';

const styles = theme => ({
    container: {

    }
});

class UserList extends PureComponent {

    eventHandler = null;

    componentDidMount() {
        this.eventHandler = this.props.subscribeUserList();

    }

    componentWillUnmount() {
        this.props.unsubscribeUserList(this.eventHandler);
    }

    render() {
        const { users } = this.props;
        return (
            <Grid container direction="column">
                <Paper elevation={5}>
                    <List>
                        <Typography variant="subtitle2" align="center">Users</Typography>
                    {
                        Object.entries(users).map(([user, data]) => (
                            <ListItem key={user}>
                                <ListItemText>{ user }</ListItemText>
                            </ListItem>
                        ))
                    }
                    </List>
                </Paper>
            </Grid>
        );
    }

    static mapState(state) {
        return {
            users: state.users
        };
    }

    static mapDispatch(dispatch) {
        return {
            subscribeUserList: () => dispatch(userActions.subscribeUserList()),
            unsubscribeUserList: (handle) => dispatch(userActions.unsubscribeUserList(handle))
        };
    }

    static get propTypes() {
        return {
            classes: PropTypes.object.isRequired
        }
    }
}

export default compose(
    withStyles(styles),
    connect(UserList.mapState, UserList.mapDispatch)
)(UserList);