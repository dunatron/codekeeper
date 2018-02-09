import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {gql, graphql, compose} from 'react-apollo'
import {timeDifferenceForDate} from '../utils';

// Material UI
import Badge from 'material-ui/Badge';
import StarIcon from 'material-ui-icons/Star';
import ThumbUpIcon from 'material-ui-icons/ThumbUp';

// Syntax highlighter
import SyntaxHighlighter from 'react-syntax-highlighter';
import {connect} from "react-redux";

const styles = theme => ({
  badge: {
    margin: `0 ${theme.spacing.unit * 2}px 0 ${theme.spacing.unit}px`,
  },
  codeSampleContainer: {
    display: 'block',
    'min-height': '40px',
    'padding': '15px',
    'text-align': 'left'
  },
  codeBody: {
    'display': 'flex',
    'flex-direction': 'column',
    'align-items': 'flex-start',
    'font-size': 'large',
    'overflow': 'scroll'
  },
  itemNumber: {
    'align-self': 'flex-start',
    'min-width': '20px'
  },
  upVoteBadge: {
    display: 'flex'
  },
  linkDescription: {
    display: 'flex'
  },
  actionsContainer: {
    display: 'flex',
    'font-size': 'small'
  },
  linkURL: {
    'font-size': 'small'
  }
});

class CodeSample extends Component {
  render() {

    const {classes, codeSample: {ID, Title, Created, CodeBody, VotesOnCode, OwnerID}} = this.props;
    const userId = localStorage.getItem('GC_USER_ID');

    return (

      <div className={classes.codeSampleContainer}>
        <h2>{Title}</h2>
        {userId ?
          <Badge className={classes.badge} onClick={() => this._voteForLink()}
                 badgeContent={VotesOnCode.length} color="primary">
            <StarIcon/>
          </Badge>
          :
          <Badge className={classes.badge} badgeContent={VotesOnCode.length} color="primary">
            {/*<ThumbUpIcon />*/}
          </Badge>
        }

          <div className={classes.codeBody}>
            <SyntaxHighlighter
              // language="javascript"
              style={this.props.style}
              showLineNumbers={this.props.showLineNumbers}>
              {CodeBody}
            </SyntaxHighlighter>
          </div>

          <div className={classes.actionsContainer}>
            <div> {VotesOnCode.length}votes |
              by {OwnerID ? OwnerID : <div>anon</div>}
              </div>
            {timeDifferenceForDate(Created)}
          </div>

      </div>
    )
  }

  _voteForLink = async () => {
    const voterID = localStorage.getItem('GC_USER_ID');
    const voterIds = this.props.codeSample.VotesOnCode.map(vote => vote.VoterID)
    if (voterIds.includes(voterID)) {
      console.log(`User (${voterID}) already voted for this link.`)
      return;
    }

    const codeSampleID = this.props.codeSample.ID
    await this.props.createVoteMutation({
      variables: {
        voterID,
        codeSampleID
      },
      update: (store, {data: {createVote}}) => {
        this.props.updateStoreAfterVote(store, createVote, codeSampleID)
      }
    })
  }

}

const CREATE_VOTE_MUTATION = gql`
  mutation CREATE_VOTE_MUTATION($voterID: ID, $codeSampleID: ID) {
  createVote(Input: {
    VoterID: $voterID,
    CodeSampleID:$codeSampleID
  }) {
    ID
    CodeSampleID
    VoterID
  }
}
`;

CodeSample.propTypes = {
  classes: PropTypes.object.isRequired,
};

const reduxWrapper = connect(
  state => ({
    selectedStyle: state.higlightStyle.selected,
    style: state.higlightStyle.style,
    showLineNumbers: state.higlightStyle.showLineNumbers
  }));

export default compose(
  graphql(CREATE_VOTE_MUTATION, {name: 'createVoteMutation'}),
  reduxWrapper,
  withStyles(styles)
)(CodeSample);

