import { default as axios } from "axios";

const instance = axios.create({
  baseURL: "https://reqres.in",
});

axios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
