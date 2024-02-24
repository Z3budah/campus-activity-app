import axios from "axios";


const getActivities = (state) => {
  // let url = '/api/activities?pub=true';
  let url = '/api/activities';
  if (state >= 0) {
    url += `?state=${state}`;
  }
  return axios.get(url);
}
const getActivity = (id) => {
  return axios.get(`/api/activities/${id}`);
}
const newActivity = (activity) => {
  return axios.post('/api/activities', activity);
}
const deleteActivity = (id) => {
  return axios.delete(`/api/activities/${id}`);
}

const updateState = (state, id) => {
  return axios.put(`/api/activities/${id}`, { state: state });
}

const updateActivity = (activity, id) => {
  return axios.put(`/api/activities/${id}`, activity);
}

export { getActivities, newActivity, deleteActivity, updateState, updateActivity, getActivity };

