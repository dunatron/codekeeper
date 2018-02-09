import React from 'react';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import {withStyles} from "material-ui/styles/index";

const noop = () => {};

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();
    if(!this.state.username || !this.state.password) {
      this.props.onError();
    } else {
      this.props.onSubmit && this.props.onSubmit(this.state.username, this.state.password);
    }
  }
  handleUserNameChange = (e) => {
    this.setState({
      username: e.target.value,
    })
  }
  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value
    })
  }
  render () {
    return (<form style={{ float: 'right' }} onSubmit={this.handleSubmit}>
      <TextField label="Username" id="username" type="text" placeholder="username" onChange={this.handleUserNameChange} value={this.state.username} />

      <TextField label="Password" type="password" onChange={this.handlePasswordChange} value={this.state.password} />
      <Button raised color="primary" type="submit">Log in</Button>
    </form>);
  }
}
LoginForm.defaultProps = {
  onSubmit: noop,
  onError: noop
}

export default LoginForm;
