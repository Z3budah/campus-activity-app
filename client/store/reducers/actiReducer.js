import * as TYPES from '../action-types';
import cloneDeep from 'lodash/cloneDeep';


const initial = {
  actiList: null
}

export default function actiReducer(state = initial, action) {
  state = cloneDeep(state);

  let { actiList } = state;
  switch (action.type) {
    case TYPES.ACTI_LIST:
      state.actiList = action.list;
      break;
    case TYPES.ACTI_UPDATE:
      if (Array.isArray(actiList)) {
        state.actiList = actiList.map(item => {
          console.log(item, action.id);
          if (item.id == action.id) {
            item.state = 2;
          }
          return item;
        });
      }
      break;
    case TYPES.ACTI_FINISH:
      if (Array.isArray(actiList)) {
        state.actiList = actiList.map(item => {
          if (item.id == action.id) {
            item.state = 3;
            item.time.end = action.endtime;
          }
          return item;
        });
      }
      break;
    case TYPES.ACTI_REMOVE:
      if (Array.isArray(actiList)) {
        state.actiList = actiList.filter(item => {
          return item.id != action.id;
        });
      }
      break;
    default:
  };

  return state;
}

//get all activities dispath({type:'ACTI_LIST',list=[...]})
//delete activity dispath({type:'ACTI_LIST',list=[...]})
//update activity dispath({type:'ACTI_LIST',list=[...]})


