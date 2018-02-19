import React, {Component} from 'react'
import {withApollo} from 'react-apollo'
import gql from 'graphql-tag'
import CodeSample from './CodeSample'
import TextField from 'material-ui/TextField';
import {withRouter} from "react-router";
import {withStyles} from "material-ui/styles/index";
import {compose, graphql} from "react-apollo/index";
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

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
  chipResults: {
    display: 'flex',
    overflowX: 'scroll',
    margin: '15px'
  },
  chip: {
    margin: theme.spacing.unit,
  },
});

class Search extends Component {

  state = {
    codecs: [],
    searchText: '',
    currentCode: null
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
            onChange={(e) => this.setState({searchText: e.target.value})}
            margin="normal"
          />

          <IconButton color="primary" className={classes.button} aria-label="Add to shopping cart"
                      onClick={() => this._executeSearch()}>
            <SearchIcon/>
          </IconButton>


        </div>
        <div className={classes.chipResults}>
          {this.state.codecs.map((code, index) => <Chip
            avatar={<Avatar>CS</Avatar>}
            label={code.Title}
            onClick={() => this.handleChipClick(code)}
            className={classes.chip}
          />)}
        </div>
        {this.state.currentCode && <CodeSample codeSample={this.state.currentCode} />}
      </div>
    )
  }

  handleChipClick = (code) => {
    this.setState({
      currentCode: code
    })
  };

  _executeSearch = async () => {
    console.log('well it has begunn.')
    // We are manually firing queries with apollo client
    const {searchText} = this.state;
    const result = await this.props.client.query({
      query: ALL_CODE_SAMPLES_SEARCH_QUERY,
      variables: {searchText}
    });

    const codecs = result.data.searchAllCodeSamples;
    this.setState({codecs});

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