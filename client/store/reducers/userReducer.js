import * as TYPES from '../user-types';
import cloneDeep from 'lodash/cloneDeep';


const initial = {
  userList: null
}

export default function userReducer(state = initial, action) {
  state = cloneDeep(state);

  let { userList } = state;
  switch (action.type) {
    case TYPES.USER_LIST:
      state.userList = action.list;
      break;
    case TYPES.USER_REMOVE:
      if (Array.isArray(userList)) {
        state.userList = userList.filter(item => {
          return item.id != action.id;
        });
      }
      break;
    case TYPES.USER_ADD:
      if (Array.isArray(userList)) {
        state.userList.push(action.user);
      }
      break;
    default:
  };

  return state;
}



