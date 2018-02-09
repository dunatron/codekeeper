import React, { Component } from 'react'
import CodeSample from './CodeSample';
import { graphql, gql, compose } from 'react-apollo'
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';

const styles = theme => ({
  linkContainer: {
    display: 'block',
    margin: '30px 15px'
  }
});

class CodeSampleList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectValue: 'select'
    };

  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  _updateCacheAfterVote = (store, createVote, linkID) => {
    // 1
    const data = store.readQuery({query: ALL_CODE_SAMPLES_QUERY});
    // 2

    console.group('Big Test');
    console.log(data);
    console.groupEnd();

    const votedLink = data.readCodeSamples.edges.find(link => link.node.ID === linkID);

    console.log(votedLink.node)
    votedLink.node.VotesOnCode.push(createVote);
    // 3
    store.writeQuery({query: ALL_CODE_SAMPLES_QUERY, data})

  };

  render() {

    const {classes} = this.props;

    // 1
    if (this.props.allCodeSamplesQuery && this.props.allCodeSamplesQuery.loading) {
      return <div>
        <div>Loading Code Samples</div>
        <CircularProgress className={classes.progress}/>
      </div>
    }
    // 2
    if (this.props.allCodeSamplesQuery && this.props.allCodeSamplesQuery.error) {
      return <div>Error</div>
    }
    // 3
    const linksToRender = this.props.allCodeSamplesQuery.readCodeSamples;

    return (
      <div className={classes.linkContainer}>
        {linksToRender.edges.map((edge, index) => (
         <CodeSample key={edge.node.ID} updateStoreAfterVote={this._updateCacheAfterVote} index={index} codeSample={edge.node} />
        ))}
      </div>
    )
  }

}

export const ALL_CODE_SAMPLES_QUERY = gql`
  query AllCodeSamplesQuery {
    readCodeSamples {
      edges {
        node {
          ID
          Title
          Created
          CodeBody
          OwnerID
          VotesOnCode {
            ID
            Title
          }
        }
      }
    }
}
`;

export default compose(
  graphql(ALL_CODE_SAMPLES_QUERY, { name: 'allCodeSamplesQuery' }),
  withStyles(styles)
) (CodeSampleList)