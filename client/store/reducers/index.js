import { combineReducers } from 'redux';
import actiReducer from './actiReducer';

const reducer = combineReducers({
  acti: actiReducer
});

export default reducer;