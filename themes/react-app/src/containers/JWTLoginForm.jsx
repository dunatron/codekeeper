import React from 'react';
import { graphql, gql, compose } from 'react-apollo';
import { setToken } from '../actions/tokenActions';
import LoginForm from '../components/Login';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withRouter} from "react-router";


class JWTLoginForm extends React.Component {

  onSubmit = (Email, Password) => {
    const { mutate } = this.props;
    mutate({
      variables: {
        Email,
        Password
      }
    })
      .then(response => {
        localStorage.setItem('jwt', response.data.createToken.Token);
        this.props.actions.setToken(response.data.createToken.Token)
      })
  };
  render () {
    return <LoginForm onSubmit={this.onSubmit} />
  }
}


const reduxWrapper = connect(
  state => ({
    token: state.token
  }),
  dispatch => ({
    actions: {
      setToken: bindActionCreators(setToken, dispatch),
    }
  }));

const tokenMutation = gql`
mutation createToken($Email: String!, $Password: String!) {
    createToken(Email: $Email, Password: $Password) {
      ID,
      FirstName,
      Token
    },
}`;

// export default graphql(tokenMutation)(JWTLoginForm);
// export default compose(
//   reduxWrapper,
//   graphql(tokenMutation)
// )(JWTLoginForm)

export default withRouter(compose(
  reduxWrapper,
  graphql(tokenMutation),
)(JWTLoginForm));