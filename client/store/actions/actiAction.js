import * as TYPES from '../action-types';
import { getActivities } from '../../api/activities'

const actiAction = {
  //async dispatch: get all activities from server,sync to redux store
  async queryAllList() {
    let list = [];
    try {
      const response = await getActivities(- 1);
      if (response.data) {
        list = response.data;
      }
    } catch (_) {
      console.log('error getting activities list');
    };
    return {
      type: TYPES.ACTI_LIST,
      list
    };
  },
  //sync dispatch: delete activity
  deleteActiById(id) {
    return {
      type: TYPES.ACTI_REMOVE,
      id
    };
  },
  //sync dispatch:update
  updateActiById(id) {
    return {
      type: TYPES.ACTI_UPDATE,
      id
    };
  },
  //sync dispatch:finish
  finishActiById(id, endtime) {
    return {
      type: TYPES.ACTI_FINISH,
      id,
      endtime
    };
  },
};

export default actiAction;
