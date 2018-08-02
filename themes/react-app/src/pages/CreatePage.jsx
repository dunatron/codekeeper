import React, { Component } from "react"
import CreateCodeSample from "../components/CreateCodeSample"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { withRouter } from "react-router"

class CreatePage extends Component {
  render() {
    return (
      <div>
        <CreateCodeSample />
      </div>
    )
  }
}

export default withRouter(CreatePage)
// export default withRouter(
//   compose(
//     reduxWrapper,
//     graphql(validateToken),
//     connect(),
//     withStyles(styles)
//   )(App)
// )
