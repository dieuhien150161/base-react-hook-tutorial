import { default as axios } from "axios";

const instance = axios.create({
  baseURL: "https://reqres.in",
});

instance.interceptors.response.use(
  function (response) {
    // Do something before request is sent
    return response.data ? response.data : { statusCode: response.status };
  },
  function (error) {
    // Do something with request error
    // return Promise.reject(error);
    let res = {};
    if (error.response) {
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    return res;
  }
);

export default instance;
