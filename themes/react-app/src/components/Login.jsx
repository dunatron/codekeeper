import React, {Component} from 'react'
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import {withStyles} from "material-ui/styles/index";
import {setToken, setUserName} from "../actions/tokenActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

const styles = theme => ({
  TextField: {
    'margin': '0 15px'
  },
  button: {
    margin: theme.spacing.unit,
    'display': 'block',
    'margin-left': 'auto',
    'margin-right': 'auto'
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class Login extends Component {

  state = {
    login: true, // switch between Login and SignUp
    FirstName: '',
    Email: '',
    Password: ''
  };

  render() {

    const {classes, validateTokenQuery: {validateToken, loading}} = this.props;

    if (loading) {
      return null;
    }

    return (
      <div>
        {validateToken.Valid && 'You are logged in.'}
        {!validateToken.Valid && <div>
          <h4 className='mv3'>{this.state.login ? 'Login' : 'Sign Up'}</h4>
          <div className='flex flex-column'>
            {!this.state.login &&
            <TextField
              label="First Name"
              className={classes.TextField}
              value={this.state.FirstName}
              onChange={(e) => this.setState({FirstName: e.target.value})}
              type='text'
              placeholder='Your name'
              margin="normal"
            />}
            <TextField
              label="Email"
              className={classes.TextField}
              value={this.state.Email}
              onChange={(e) => this.setState({Email: e.target.value})}
              type='text'
              placeholder='Your email address'
              margin="normal"
            />
            <TextField
              label="Password"
              className={classes.TextField}
              value={this.state.Password}
              onChange={(e) => this.setState({Password: e.target.value})}
              type='password'
              placeholder='Choose a safe password'
              margin="normal"
            />
          </div>
          <div className='flex mt3'>
            <Button
              className={classes.button} raised color="primary"
              onClick={() => this._confirm()}>
              {this.state.login ? 'login' : 'create account'}
            </Button>
            <Button
              className={classes.button} raised color="primary"
              onClick={() => this.setState({login: !this.state.login})}>
              {this.state.login ? 'need to create an account?' : 'already have an account?'}
            </Button>
          </div>
        </div>}
      </div>
    )
  }

  _confirm = async () => {
    const {FirstName, Email, Password} = this.state;

    if (this.state.login) {
      // LOGIN
      await this.props.signinUserMutation({
        variables: {
          Email,
          Password,
        },
      })
        .then(response => {
          const {ID, Token, FirstName} = response.data.createToken;
          console.log(response.data.createToken)
          if (typeof Token === 'undefined' || Token === null) {
            console.log('TOKEN IS NOT DEFINED');
            alert('Credentials are not valid: Please try again')
          } else {
            //localStorage.setItem('jwt', Token);
            this._saveUserData(ID, Token, FirstName);
          }
        })
        .catch(err => console.log(err));


    } else {
      // SIGN_UP
      await this.props.createUserMutation({
        variables: {
          FirstName,
          Email,
          Password,
        },
      })
        .then((res) => {
          // const {ID, token} = res.data.createMember
          const {createMember, createToken} = res.data;
          this._saveUserData(createToken.ID, createToken.Token, createToken.FirstName);
        })
        .catch((err) => {
          alert(err)
        });
    }

  };

  _saveUserData = (id, token, name) => {
    localStorage.setItem('GC_USER_ID', id);
    localStorage.setItem('GC_USER_NAME', name);
    // localStorage.setItem('USER_NAME', id);
    localStorage.setItem('jwt', token);
    this.props.history.push(`/`);
  }

}

// This allows for sending 2 request in 1. Sign-up and sign in with a JWToken
const CREATE_USER_MUTATION = gql`
  mutation newUser( $FirstName: String, $Email: String!, $Password: String!) {
  createMember(Input: {
    FirstName: $FirstName,
    Email: $Email,
    Password: $Password
  }) {
    ID
    Name
    FirstName
    Email
  }
 
  createToken(Email: $Email, Password: $Password) {
    ID,
    FirstName,
    Token
  }
}
`;
// Basic mutation for retrieving a JWToken on login
const SIGNIN_USER_MUTATION = gql`
mutation createToken($Email: String!, $Password: String!) {
    createToken(Email: $Email, Password: $Password) {
      ID,
      FirstName,
      Token
    },
}`;
const validateToken = gql`
query validateToken {
    validateToken {
      Valid
      Message
      Code
    }
}`;

const reduxWrapper = connect(
  state => ({
    token: state.token,
  }),
  dispatch => ({
    actions: {
      setToken: bindActionCreators(setToken, dispatch),
      setUserName: bindActionCreators(setUserName, dispatch)
    }
  }));

export default compose(
  reduxWrapper,
  graphql(validateToken),
  graphql(validateToken, {name: 'validateTokenQuery'}),
  graphql(CREATE_USER_MUTATION, {name: 'createUserMutation'}),
  graphql(SIGNIN_USER_MUTATION, {name: 'signinUserMutation'}),
  withStyles(styles)
)(Login);