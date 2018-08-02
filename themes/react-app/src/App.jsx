import React, { Component } from "react"
import { graphql, gql, compose } from "react-apollo"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { setToken, setUserName } from "./actions/tokenActions"
import ReactLogo from "./img/logo.svg"
import "./App.css"
import WebpackLogo from "./img/webpack.svg"
import SSLogo from "./img/silverstripe-logo.png"
import GraphQLLogo from "./img/GraphQL_Logo.svg.png"
import Header from "./components/Header"
import { withStyles } from "material-ui/styles"
import LoginForm from "./components/Login"
import CreateLink from "./components/CreateCodeSample"
import CodeSampleList from "./components/CodeSampleList"
import Search from "./components/Search"
// import { Switch, Route } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { withRouter } from "react-router"
// Pages
import LandingPage from "./pages/LandingPage"
import HomePage from "./pages/HomePage"
import CreatePage from "./pages/CreatePage"

const styles = {
  cardHolder: {
    display: "flex",
    "align-items": "center",
    overflow: "auto",
    "box-sizing": "border-box",
    width: "100%",
    "justify-content": "center",
    "flex-direction": "row",
    "flex-wrap": "wrap",
    "flex-flow": "row wrap",
    "align-content": "flex-end",
  },
  webpackLogo: {
    marginLeft: "30px",
  },
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      UserName: "Anon",
    }
  }

  onClick = e => {
    e.preventDefault()
    this.props.actions.setUserName(this.state.UserName)
  }

  render() {
    const {
      data: { validateToken, loading },
      classes,
    } = this.props

    if (loading) {
      return null
    }

    const landingPageComponent = (
      <LandingPage>
        <CreatePage link="/create" />
      </LandingPage>
    )

    const MyLandingPage = props => {
      return (
        <LandingPage
          //toggleSidebarOn={this.toggleSidebarOn.bind(this)}
          // children={[CreatePage, HomePage]}
          children={[<CreatePage link="/create" />, <HomePage link="/home" />]}
          {...props}
        />
      )
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={SSLogo} className="ss-logo" alt="SilverStripe logo" />
          <img src={ReactLogo} className="App-logo" alt="React logo" />
          <img src={GraphQLLogo} className="App-logo" alt="graphQL logo" />
          <img
            src={WebpackLogo}
            className="App-logo"
            style={styles.webpackLogo}
            alt="Webpack logo"
          />
        </header>
        <Header />
        <Switch>
          {/* <Route exact path='/' component={CodeSampleList}/> */}
          <Route exact path="/" render={MyLandingPage} />
          <Route exact path="/create" component={CreateLink} />
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/search" component={Search} />
        </Switch>
      </div>
    )
  }
}

// Connect redux to our component
const reduxWrapper = connect(
  state => ({
    token: state.token,
  }),
  dispatch => ({
    actions: {
      setToken: bindActionCreators(setToken, dispatch),
      setUserName: bindActionCreators(setUserName, dispatch),
    },
  })
)

const validateToken = gql`
  query validateToken {
    validateToken {
      Valid
      Message
      Code
    }
  }
`

export default withRouter(
  compose(
    reduxWrapper,
    graphql(validateToken),
    connect(),
    withStyles(styles)
  )(App)
)
