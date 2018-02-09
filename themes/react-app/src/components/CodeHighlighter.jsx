import React from 'react';
import { render } from 'react-dom';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {compose, gql, graphql} from "react-apollo/index";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {setStyle, toggleShowLineNumbers} from "../actions/higlightCodeActions";
import {withStyles} from "material-ui/styles/index";
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/Menu/MenuItem';
import {bindActionCreators} from "redux";


import * as HighlightStyles from 'react-syntax-highlighter/dist/styles/hljs'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
});

const availableStyles = [
  'agate',
  'androidstudio',
  'arduino-light',
  'arta',
  'ascetic',
  'atelier-cave-dark',
  'atelier-cave-light',
  'atelier-dune-dark',
  'atelier-dune-light',
  'atelier-estuary-dark',
  'atelier-estuary-light',
  'atelier-forest-dark',
  'atelier-forest-light',
  'atelier-heath-dark',
  'atelier-heath-light',
  'atelier-lakeside-dark',
  'atelier-lakeside-light',
  'atelier-plateau-dark',
  'atelier-plateau-light',
  'atelier-savanna-dark',
  'atelier-savanna-light',
  'atelier-seaside-dark',
  'atelier-seaside-light',
  'atelier-sulphurpool-dark',
  'atelier-sulphurpool-light',
  'brown-paper',
  'codepen-embed',
  'color-brewer',
  'dark',
  'darkula',
  'defaultStyle',
  'docco',
  'far',
  'foundation',
  'github-gist',
  'github',
  'googlecode',
  'grayscale',
  'hopscotch',
  'hybrid',
  'idea',
  'ir-black',
  'kimbie.dark',
  'kimbie.light',
  'magula',
  'mono-blue',
  'monokai-sublime',
  'monokai',
  'obsidian',
  'paraiso-dark',
  'paraiso-light',
  'pojoaque',
  'railscasts',
  'rainbow',
  'school-book',
  'solarized-dark',
  'solarized-light',
  'sunburst',
  'tomorrow-night-blue',
  'tomorrow-night-bright',
  'tomorrow-night-eighties',
  'tomorrow-night',
  'tomorrow',
  'vs',
  'xcode',
  'xt256',
  'zenburn'
];
class CodeHighlighter extends React.Component {
  constructor() {
    super();

    this.state = {
      selected: 'tomorrow-night-eighties',
      style: require('../../node_modules/react-syntax-highlighter/dist/styles/hljs/tomorrow-night-eighties').default,
      showLineNumbers: false
    }
  }
  render() {
    const h1Style = {
      fontSize: 42,
      color: 'aliceblue'
    };
    const h2 = {
      fontSize: 24,
      color: 'aliceblue'
    };

    console.group('State VS Props');
    console.log(this.state);
    console.log(this.props);
    console.groupEnd();

    const {selectedStyle, style, showLineNumbers, classes} = this.props;

    return (
      <div>
        <TextField
          id="select-currency"
          select
          label="Select"
          className={classes.textField}
          value={selectedStyle}
          onChange={(e) => this.props.dispatch(setStyle(e.target.value, require(`../../node_modules/react-syntax-highlighter/dist/styles/hljs/${e.target.value}`).default))}
          // onChange={(e) => {
          //   console.log(e)
          //   //this.props.dispatch(setStyle(e.target.value, HighlightStyles.`${e.target.value}`))}
          // }
          // onChange={(e) => {
          //   console.log('wtf');
          //   console.log(e);
          //  this.props.dispatch(setStyle(e.target.value, require(`../../node_modules/react-syntax-highlighter/dist/styles/hljs/${e.target.value}`)))
          // }}
          // // SelectProps={{
          //   MenuProps: {
          //     className: classes.menu,
          //   },
          // }}
          helperText="Please select your currency"
          margin="normal"
        >
          {availableStyles.map(s => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>




        <div style={{paddingTop: '10px', fontSize: 16, color: 'aliceblue'}}>
          <label htmlFor="showLineNumbers">Show Line Numbers:</label>
          <input
            type="checkbox"
            checked={showLineNumbers}
            // onChange={() => this.setState({ showLineNumbers: !this.state.showLineNumbers })}
            onChange={() => this.props.dispatch(toggleShowLineNumbers(!showLineNumbers))}
            id="showLineNumbers"
          />
        </div>
      </div>
    );
  }
}

// Connect redux to our component
const reduxWrapper = connect(
  state => ({
    selectedStyle: state.higlightStyle.selected,
    style: state.higlightStyle.style,
    showLineNumbers: state.higlightStyle.showLineNumbers
  }));
export default compose(
  reduxWrapper,
  withStyles(styles)
)(CodeHighlighter);
