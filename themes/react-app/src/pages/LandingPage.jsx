import React, { Component } from "react"
// Pages
import HomePage from "./HomePage"
import CreatePage from "./CreatePage"
import LoginPage from "./LoginPage"
import SearchPage from "./SearchPage"

class LandingPage extends Component {
  render() {
    console.log("Landing Page Props ", this.props)
    console.log("Landing Page children ", this.props.children)
    const { children } = this.props
    // const pages = children.map(Page => {
    //   return <Page />
    // })
    // return <div>{children && children.map(child => child)}</div>
    return (
      <div style={{ display: "flex" }}>
        {/* {children.length > 0 && children.map(child => child)} */}
        {/* {children.length > 0 &&
          children.map(child => ({ props }) => {
            console.log("The Props for each Child -> ", props)
            return <child />
          })} */}
        {/* {children.length > 0 && children.map(child => ({ props }) => child)} */}
        {children.length > 0 &&
          children.map(child => {
            const { props } = child
            console.log("The Props for each Child -> ", props)
            return (
              <div
                style={{
                  zoom: 0.75,
                  transform: "scale(0.75)",
                }}>
                Link:{props.link ? props.link : "(no link)"}
                {child}
              </div>
            )
          })}
      </div>
    )
  }
}

export default LandingPage
