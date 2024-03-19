import * as TYPES from '../user-types';
import { getUsers } from '../../api/users';

const userAction = {
  //async dispatch: get all users from server,sync to redux store
  async queryAllUsers() {
    let list = [];
    try {
      const response = await getUsers();
      if (response.data) {
        list = response.data;
      }
    } catch (_) {
      console.log('error getting users list');
    };
    return {
      type: TYPES.USER_LIST,
      list
    };
  },
  //sync dispatch: delete user
  deleteUserById(id) {
    return {
      type: TYPES.USER_REMOVE,
      id
    };
  },
  //sync dispatch: add user
  addUser(user) {
    return {
      type: TYPES.USER_ADD,
      user
    };
  },
};

export default userAction;
