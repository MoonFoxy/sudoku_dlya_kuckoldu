import axios from 'axios';

const $axios = axios.create({
  // TODO: for some reasone devServer.proxy setting
  // in the vue.config.js doesn't work
  // https://cli.vuejs.org/config/#devserver
  // So temorary, we set the full URL here
  // baseURL: 'http://localhost:5000/api/',
  baseURL: 'http://localhost:5000/api/',
  timeout: 5000,
  headers: {'Content-Type': 'application/json'},
});

// Request Interceptor
$axios.interceptors.request.use(config => {
  const newConfig = config;
  if (newConfig.headers) newConfig.headers.Authorization = 'Fake Token';
  return newConfig;
});

// Response Interceptor to handle and log errors
$axios.interceptors.response.use(
  response => response,
  error =>
    // Handle Error
    Promise.reject(error)
);

export interface User {
  id: String;
  username: String;
  email: String;
}

export const backend = {
  getUsers() {
    return $axios.get('users/').then(response => response.data);
  },

  getUser(id: String) {
    return $axios.get(`user/${id}`).then(response => response.data);
  },

  createUser(data: User) {
    const user = {
      username: data.username,
      email: data.email,
    };
    return $axios.post('users/', user).then(response => response.data);
  },

  updateUser(id: String, data: User) {
    const user = {
      username: data.username,
      email: data.email,
    };
    return $axios.post(`users/${id}`, user).then(response => response.data);
  },

  deleteUser(id: String) {
    return $axios.delete(`users/${id}`).then(response => response.data);
  },
};
