import axios from "axios";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
const ENV = process.env.NODE_ENV;
let API_URL = "https://backend.vacay.live/api";

if (ENV === "development") {
  API_URL = "http://localhost:8000/api";
}

axios.defaults.withCredentials = true;

const axiosApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosApi.interceptors.request.use(
  (config) => {
    let access_token = localStorage.getItem("access_token");

    if (access_token) {
      config.headers.Authorization = 'Bearer ' + access_token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.data && error.response.data.code === "token_not_valid") {
      history.push("/logout");
    } else {
      throw error.response.data;
      // Promise.reject(error.response)
    }
  }
);

export async function get(url, config = {}) {
  return axiosApi
    .get(url, { ...config })
    .then((response) => response.data);
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function patch(url, data, config = {}) {
  return axiosApi
    .patch(url, { ...data }, { ...config })
    .then((response) => response.data);
}

export async function del(url, data, config = {}) {
  console.log(data)
  return axiosApi
    .delete(url, { ...config }, { ...data },)
    .then((response) => response.data);
}

export async function s3Post(url, image) {
  let config = {
    method: "put",
    url: url,
    data: image,
    withCredentials: false,
    headers: {
      "Content-Type": image.type,
    },
  };

  return axios(config);
}
