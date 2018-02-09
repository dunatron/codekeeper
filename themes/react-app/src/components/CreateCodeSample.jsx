import React, {Component} from 'react'
import {graphql, gql, compose} from 'react-apollo'

import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import {ALL_CODE_SAMPLES_QUERY} from './CodeSampleList'

import SyntaxHighlighter from 'react-syntax-highlighter';
import {connect} from "react-redux";

const styles = theme => ({
  createNewsForm: {
    'padding': '20px',
    'margin': '20px',
    'text-align': 'left'
  },
  createLinkTextFields: {
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
  editorField: {
    width: '100%'
  },
  MuiTextarea: {
    width: '100%'
  }
});

class CreateCodeSample extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      codeString: '(num) => num + 1'
    };

  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {

    const {classes} = this.props;

    return (
      <form className={classes.createNewsForm} noValidate autoComplete="off">

        {/*<SyntaxHighlighter language='javascript' style={dark}>{this.state.codeString}</SyntaxHighlighter>*/}

        <TextField
          id="CreateLink_title"
          label="title"
          className={classes.createLinkTextFields}
          value={this.state.title}
          onChange={(e) => this.setState({title: e.target.value})}
          type='text'
          placeholder='Code Sample Title'
          margin="normal"
        />

        <SyntaxHighlighter
          // language='javascript'
          style={this.props.style}
          showLineNumbers={this.props.showLineNumbers}>
          {this.state.codeString}
        </SyntaxHighlighter>

        <TextField
          id="Create_New_CodeSample"
          className={classes.editorField}
          value={this.state.codeString}
          onChange={(e) => this.setState({codeString: e.target.value})}
          label="With placeholder multiline"
          placeholder="Enter your code here"
          multiline
          margin="normal"
        />

        <Button className={classes.button} raised color="primary" onClick={() => this._createLink()}>
          Send
          <Icon className={classes.rightIcon}>send</Icon>
        </Button>
      </form>
    )
  }

  _createLink = async () => {
    const createdById = localStorage.getItem('GC_USER_ID');

    if (!createdById) {
      alert('You shall not create without signing in...');
      this.props.history.push(`/login`);
      return;
    }

    const {title, codeString} = this.state;

    await this.props.createCodeSampleMutation({
      variables: {
        title,
        codeString,
        createdById
      },
      update: (store, {data: {createCode_Sample}}) => {
        const data = store.readQuery({query: ALL_CODE_SAMPLES_QUERY})
        console.log(data);
        data.readCodeSamples.edges.splice(0,0,createCode_Sample)
        store.writeQuery({
          query: ALL_CODE_SAMPLES_QUERY,
          data
        })
      }
    });

    this.props.history.push(`/`)
  }

}

const CREATE_CODE_SAMPLE_MUTATION = gql`
  # 2
  mutation CreateCodeSampleMutation($title: String, $codeString: String $createdById: ID) {
    createCode_Sample(Input: {
      Title: $title
      CodeBody: $codeString
      OwnerID: $createdById
    }) {
    	ID,
    	Created,
    	Title,
    	CodeBody
    	OwnerID
    }
  }
`;


CreateCodeSample.propTypes = {
  classes: PropTypes.object.isRequired,
};

const reduxWrapper = connect(
  state => ({
    selectedStyle: state.higlightStyle.selected,
    style: state.higlightStyle.style,
    showLineNumbers: state.higlightStyle.showLineNumbers
  }));

// 3
export default compose(
  graphql(CREATE_CODE_SAMPLE_MUTATION, {name: 'createCodeSampleMutation'}),
  reduxWrapper,
  withStyles(styles)
)(CreateCodeSample);