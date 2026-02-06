import axios, { InternalAxiosRequestConfig } from "axios";

let accessToken: string | null = ""; // Memory storage

export const setAccessToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};
export const getAccessToken = () => {
  return accessToken;
};

const axiosInstance = axios.create({
  baseURL: process.env.BASE_API_URL || "http://localhost:3000/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "Application/json",
  },
});

// REQUEST Interceptor: Attach the memory token to every call
// middleware that is run everytime before a requst is send
// axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   return config;
// });

let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: any[] = [];

//  its a function that takes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// middleware that run after responce is recieve
axiosInstance.interceptors.response.use(
  (res) => res,
  // we here want to work with the error only
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If a refresh is already in progress, add this request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        axios
          .post("/api/auth/refresh", {}, { withCredentials: true })
          .then((res) => {
            const newAccessToken = res.data.data.accessToken;
            setAccessToken(newAccessToken);

            // 1. Fix the current request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // 2. Fix all the other waiting requests
            processQueue(null, newAccessToken);

            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            // Handle Logout Logic here
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  },
);
export { axiosInstance as axios };
