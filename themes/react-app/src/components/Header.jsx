import React, {Component} from 'react'
import { withApollo, graphql, compose } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import {Link} from 'react-router-dom';
import CodeHighlighterSettings from './CodeHighlighter';

// Material UI
import Menu, {MenuItem} from 'material-ui/Menu';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Tooltip from 'material-ui/Tooltip';
import AccountCircle from 'material-ui-icons/AccountCircle';
import AddIcon from 'material-ui-icons/Add';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import {Home} from 'material-ui-icons';
import MenuIcon from 'material-ui-icons/Menu';
import SearchIcon from 'material-ui-icons/Search';
import Drawer from 'material-ui/Drawer';

import { setToken, setUserName } from '../actions/tokenActions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withRouter} from "react-router";


const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  list: {
    width: 250,
  },
  listFull: {
    width: 'auto',
  },
  menuIconBtn: {
    'margin': '0 5px'
  }
};

class Header extends Component {

  state = {
    auth: true,
    anchorEl: null,
    left: false,
  };

  // ToDo: Not evenly remotely happy about the Login/Logout {VERY FIDDLY}
  _logout = async () => {

    const {client, validateToken, loading, classes} = this.props;

    await localStorage.removeItem('GC_USER_ID');
    await localStorage.removeItem('jwt');
    await localStorage.removeItem('GC_USER_NAME');

    this.resetStore().then((res) => {
      console.log('reset', res);
    });

    this.props.history.push(`/`)
    // await client.resetStore();

  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  resetStore = async () => {
    const {client, validateToken, loading, classes} = this.props;
    //await client.resetStore();
  };

  handleChange = (event, checked) => {
    this.setState({auth: checked});
  };

  handleMenu = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl: null});
  };

  render() {

    const {auth, anchorEl} = this.state;
    const open = Boolean(anchorEl);

    const userId = localStorage.getItem('GC_USER_ID');
    const userName = localStorage.getItem('GC_USER_NAME');
    const {client, validateToken, loading, classes} = this.props;


    if (loading) {
      return null;
    }

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton} color="contrast" aria-label="Menu"
              onClick={this.toggleDrawer('left', true)}
            >
              <MenuIcon/>
            </IconButton>

            <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer('left', false)}
                onKeyDown={this.toggleDrawer('left', false)}
              >
                CLOSE
              </div>
              <CodeHighlighterSettings />
            </Drawer>

            <Link to='/' className={classes.menuIconBtn}>
              <Tooltip id="tooltip-all-links" placement="top" title="Go to home with all code samples">
                <Button fab mini color="primary" aria-label="go to links">
                  <Home />
                </Button>
              </Tooltip>
            </Link>

            <Link to='/search' className={classes.menuIconBtn}>
              <Tooltip id="tooltip-all-links" placement="top" title="search all code samples">
                <Button fab mini color="primary" aria-label="go to links">
                  <SearchIcon />
                </Button>
              </Tooltip>
            </Link>

            {userId && <Link to='/create' className={classes.menuIconBtn}>
              <Tooltip id="tooltip-fab" placement="left"  title="create new code sample">
                <Button fab mini color="primary" aria-label="Add">
                  <AddIcon/>
                </Button>
              </Tooltip>
            </Link>}



            <Typography type="title" color="inherit" className={classes.flex}>
              [CODE KEEPER]
            </Typography>

            {userName}

            <div>
              <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle/>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
              >
                {userName ?
                  <div>
                    <MenuItem onClick={this.handleClose}>{userName}</MenuItem>
                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                    <MenuItem onClick={() => this._logout()}>Logout</MenuItem>
                  </div>
                  :
                  <div>
                    <MenuItem onClick={this.handleClose}>
                      <Link to='/login' className='ml1 no-underline black'>
                        <Button color="contrast">Login</Button>
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                  </div>
                }

              </Menu>
            </div>

          </Toolbar>
        </AppBar>
      </div>
    )
  }

}

const reduxWrapper = connect(
  state => ({
    token: state.token,
  }),
  dispatch => ({
    actions: {
      setToken: bindActionCreators(setToken, dispatch),
      setUserName: bindActionCreators(setUserName, dispatch)
    }
  }));

Header.propTypes = {
  client: PropTypes.instanceOf(ApolloClient),
  classes: PropTypes.object.isRequired,
};

const validateToken = gql`
query validateToken {
    validateToken {
      Valid
      Message
      Code
    }
}`;

export default withRouter(compose(
  withApollo,
  withStyles(styles),
  graphql(validateToken, {
    props: ({ data: { loading, validateToken }, client }) => ({
      loading,
      validateToken
    }),
  }),
  reduxWrapper
)(Header));
