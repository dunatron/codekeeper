import React, { Component } from 'react';
import { gql, graphql, compose } from 'react-apollo';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import EventCard from '../components/EventCard';

const styles = theme => ({
  progress: {
    margin: '100px'
  }
});

const EventQuery = gql`
query readEvents {
  readEvents {
    edges {
      node {
        ID
        ...EventOverview
      }
    }
  }
}
${EventCard.fragments.event}
`;

class EventList extends Component {
  render () {
    const { classes, data: { loading, readEvents } } = this.props;

    if (loading) {
      return <CircularProgress className={classes.progress} />;
    }

    return readEvents.edges.map(edge => {
      return <EventCard event={edge.node} key={edge.node.ID} />;
    });
  }
}

export default compose(
  withStyles(styles),
  graphql(EventQuery)
)(EventList);