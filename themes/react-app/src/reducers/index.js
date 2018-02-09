import token from './tokenReducer';
import higlightStyle from './highlightReducer';
import { combineReducers } from 'redux';

export default combineReducers({
  token,
  higlightStyle
})