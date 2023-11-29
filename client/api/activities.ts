import axios from "axios";


const getActivities = (state:number)=>{
  // let url = '/api/activities?pub=true';
  let url = '/api/activities';
  if(state >= 0){
    url += `?state=${state}`;
  }
  return axios.get(url);
} 

const  newActivity = (activity:Object)=>{
  return axios.post('/api/activities', activity);
}
const  deleteActivity = (id:number)=>{
  return axios.delete(`/api/activities/${id}`);
}

const updateState = (state:number,id:number)=>{
  return axios.put(`/api/activities/${id}`, { state:state });
}

const updateActivity = (activity:Object,id:number)=>{
  return axios.put(`/api/activities/${id}`, activity);
}

export {getActivities, newActivity, deleteActivity, updateState,updateActivity};

  