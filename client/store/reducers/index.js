import { combineReducers } from 'redux';
import actiReducer from './actiReducer';
import userReducer from './userReducer'

const reducer = combineReducers({
  acti: actiReducer,
  user: userReducer
});

export default reducer;