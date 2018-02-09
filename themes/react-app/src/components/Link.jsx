import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {gql, graphql, compose} from 'react-apollo'
import {timeDifferenceForDate} from '../utils';

// Material UI
import Badge from 'material-ui/Badge';
import ThumbUpIcon from 'material-ui-icons/ThumbUp';


const styles = theme => ({
  badge: {
    margin: `0 ${theme.spacing.unit * 2}px 0 ${theme.spacing.unit}px`,
  },
  linkContainer: {
    display: 'flex',
    'align-items': 'center',
    'min-height': '40px',
    'padding': '15px',
    'text-align': 'left'
  },
  linkBody: {
    'display': 'flex',
    'flex-direction': 'column',
    'align-items': 'flex-start',
    'font-size': 'large'
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

class Link extends Component {
  render() {
    const {classes} = this.props;
    const userId = localStorage.getItem('GC_USER_ID');
    return (
      <div className={classes.linkContainer}>
        <div className={classes.itemNumber}>{this.props.index + 1}.</div>
        {/*{userId && <div onClick={() => this._voteForLink()}>UPVOTE</div>}*/}


        {userId ? <Badge className={classes.badge} onClick={() => this._voteForLink()}
                         badgeContent={this.props.link.VotesOnLink.length} color="primary">
            <ThumbUpIcon/>
          </Badge>
          :
          <Badge className={classes.badge} badgeContent={this.props.link.VotesOnLink.length} color="primary">
            {/*<ThumbUpIcon />*/}
          </Badge>
        }

        <div className={classes.linkBody}>
          <div className={classes.linkDescription}>
            <div>{this.props.link.description} <span className={classes.linkURL}>({this.props.link.url})</span></div>
          </div>

          <div className={classes.actionsContainer}>
            <div> {this.props.link.VotesOnLink.length}votes |
              by {this.props.link.OwnerID ? this.props.link.OwnerID : <div>anon</div>}</div>
            {timeDifferenceForDate(this.props.link.Created)}
          </div>
        </div>

      </div>
    )
  }

  _voteForLink = async () => {
    const voterID = localStorage.getItem('GC_USER_ID');
    const voterIds = this.props.link.VotesOnLink.map(vote => vote.VoterID)
    if (voterIds.includes(voterID)) {
      console.log(`User (${voterID}) already voted for this link.`)
      return;
    }

    const linkID = this.props.link.ID
    await this.props.createVoteMutation({
      variables: {
        voterID,
        linkID
      },
      update: (store, {data: {createVote}}) => {
        this.props.updateStoreAfterVote(store, createVote, linkID)
      }
    })
  }

}

const CREATE_VOTE_MUTATION = gql`
  mutation CREATE_VOTE_MUTATION($voterID: ID, $linkID: ID) {
  createVote(Input: {
    VoterID: $voterID,
    LinkID:$linkID
  }) {
    ID
    LinkID
    VoterID
  }
}
`;

Link.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  graphql(CREATE_VOTE_MUTATION, {name: 'createVoteMutation'}),
  withStyles(styles)
)(Link);

