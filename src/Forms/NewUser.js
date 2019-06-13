import React, { PureComponent } from 'react';
import { Form, ProgressInput } from '../UI/Forms';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { debounce } from '../util';
import { authActions } from '../Store';
import Progress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { ModelContext } from '../Models/withModelManager';

class NewUser extends PureComponent {

    state = {
        name: ''
    };

    checkIsAvailable = debounce(() => {
        const { name } = this.state;
        this.props.checkUserAvailable(name);
    }, 500);

    onChange = this.onChange.bind(this);
    onChange(event) {
        const { name, value } = event.target;

        this.setState({
            [name]: value
        });

        if (value !== '')
            this.checkIsAvailable();
    }

    CheckStatus = this.CheckStatus.bind(this)
    CheckStatus() {
        const { available } = this.props;
        const { name } = this.state;

        if (name === '' )
            return null;

        if (available[name] && available[name].checkingAvailable) {
            return <Progress thickness={5} size={20} />;
        } else if (available[name] && available[name].available) {
            return  <CheckIcon style={{ color: '#00d000' }}/>;
        } else if (available[name] && !available[name].available){
            return <ClearIcon style={{ color: 'red'}} />;
        } else {
            return null;
        }
    }

    render() {
        const { name } = this.state;
        const { available } = this.props;

        return (
            <Form onSubmit={this._onSubmit} style={{ minWidth: '300px' }}>
                <ProgressInput
                    label="Create Your Handle"
                    available={available[name]}
                    asyncAction={this.CheckStatus}
                    name={'name'}
                    value={name}
                    onChange={this.onChange}/>

                <Grid container justify="flex-end">
                    <Button
                        style={{ margin: '0 -12px'}}
                        variant="outlined"
                        type="submit"
                        disabled={!(available[name] && available[name].available)}
                        >Submit</Button>
                </Grid>
            </Form>
        );
    }

    _onSubmit = this._onSubmit.bind(this);
    _onSubmit() {
        this.props.createUser({ user: this.state.name, model: this.context });
    }

    static mapState(state) {
        return {
            available: state.auth.availableHandles,
        };
    }
    static mapDispatch(dispatch){
        return {
            checkUserAvailable: user => dispatch(authActions.checkUserAvailable(user)),
            createUser: props => dispatch(authActions.createUser(props))
        };
    }
    static contextType = ModelContext;
}

export default connect(NewUser.mapState, NewUser.mapDispatch)(NewUser);
