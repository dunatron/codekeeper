import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import CodeSample from './CodeSample'
import TextField from 'material-ui/TextField';
import {withRouter} from "react-router";
import {withStyles} from "material-ui/styles/index";
import {compose, graphql} from "react-apollo/index";
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';

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

class Search extends Component {

  state = {
    codecs: [],
    searchText: ''
  };

  render() {

    console.log(this.state.codecs);

    const {classes} = this.props;

    return (
      <div>
        <div>
          <TextField
            id="search"
            label="Search field"
            type="search"
            className={classes.textField}
            onChange={(e) => this.setState({ searchText: e.target.value })}
            margin="normal"
          />

          <IconButton color="primary" className={classes.button} aria-label="Add to shopping cart" onClick={() => this._executeSearch()}>
            <SearchIcon />
          </IconButton>


        </div>
        {this.state.codecs.map((code, index) => <CodeSample key={code.id} codeSample={code} index={index}/>)}
      </div>
    )
  }

  _executeSearch = async () => {
    console.log('well it has begunn.')
    // We are manually firing queries with apollo client
    const {searchText} = this.state;
    const result = await this.props.client.query({
      query: ALL_CODE_SAMPLES_SEARCH_QUERY,
      variables: {searchText}
    });

    console.group('Search executes');
    console.log(result);


    const codecs = result.data.searchAllCodeSamples;
    this.setState({codecs});

    console.log(this.state.codecs);
    console.log(codecs)


  }

}

const ALL_CODE_SAMPLES_SEARCH_QUERY = gql`
query searchLinks($searchText: String!) {
  searchAllCodeSamples(filter: $searchText) {
    ID
   	Title
    Created
    CodeBody
    OwnerID
    VotesOnCode {
    	ID
    	VoterID
  	}
  }
}
`;

// export default withApollo(Search)

export default withRouter(compose(
  withApollo,
  withStyles(styles),
)(Search));