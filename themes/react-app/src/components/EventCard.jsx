import React, {Component} from 'react';
import {gql} from 'react-apollo';
import {propType as fragmentPropType} from 'graphql-anywhere';
import {withStyles} from 'material-ui/styles';
import Card, {CardActions, CardContent, CardMedia} from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = {
  card: {
    'minWidth': 'min-content',
    'maxWidth': '300px',
    'flex-shrink': '0',
    'margin': '10px',
  },
  media: {
    height: 200,
  }
};

class EventCard extends Component {
  render() {
    const {classes, event: {Title, Thumbnail, Owner, BgColor, Category}} = this.props;
    const color ="#" + BgColor;
    return (
      <Card className={classes.card}
            style={{backgroundColor: color}}>
        <CardMedia

          className={classes.media}
          image={Thumbnail}
          title={Title}
        />
        <CardContent>
          <Typography type='headline' component='h2' align='left'>
            {Title}
          </Typography>
          <Typography component='p' align='left'>
            created by: {Owner.Name}.
          </Typography>
          <Typography component='p' align='left'>
            category: {Category.Name}.
          </Typography>
        </CardContent>
        <CardActions>
          <Button dense color='primary'>
            Learn More
          </Button>
        </CardActions>
      </Card>
    );
  }
}

EventCard.fragments = {
  event: gql`
    fragment EventOverview on Event {
      Title
      Thumbnail
      BgColor
      Owner {
        Name
        Surname
      }
      Category {
        Name
        BgColor
      }
    }
  `
};

EventCard.propTypes = {
  event: fragmentPropType(EventCard.fragments.event).isRequired
};

export default withStyles(styles)(EventCard);