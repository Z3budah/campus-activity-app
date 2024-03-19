import axios from "axios";

const getUsers = () => {
  let url = '/api/users/allusers';
  return axios.get(url);
}

const newUser = (user) => {
  return axios.post('/api/users/signup', user);
}

const deleteUser = (id) => {
  return axios.delete(`/api/users/${id}`);
}

const updateUser = (user) => {
  return axios.post(`/api/users/change-password`, { ...user });
}



export { getUsers, newUser, deleteUser, updateUser };

