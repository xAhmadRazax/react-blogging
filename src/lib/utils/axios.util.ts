import axios, { InternalAxiosRequestConfig } from "axios";

let accessToken: string | null = ""; // Memory storage

export const setAccessToken = (token: string | null) => {
  if (token) {
    accessToken = token;
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    accessToken = null;
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};
export const getAccessToken = () => {
  return accessToken;
};

function getBaseUrl() {
  const url = process.env.BASE_API_URL || "http://localhost:3000/api";
  return url.endsWith("/") ? url.slice(0, -1) : url; // Remove trailing slash
}

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
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
    let cookiesStore: string;
    if (typeof window === "undefined") {
      const { cookies } = await import("next/headers");
      const tempCookiesStore = await cookies();
      cookiesStore = tempCookiesStore.toString();
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If a refresh is already in progress, add this request to the queue
      if (isRefreshing) {
        console.log(
          "setting new token.... refreshing.......... axios-instence.................",
        );

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
        axiosInstance
          .post(
            `${getBaseUrl()}/auth/refresh`,
            {},
            {
              withCredentials: true,
              headers: {
                Cookie: cookiesStore ? cookiesStore : null,
              },
            },
          )
          .then((res) => {
            const newAccessToken = res.data.data.accessToken;
            setAccessToken(newAccessToken);

            console.log(
              "setting new token.... axios-instence.................",
            );
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

// ---------------------------

// function getBaseUrl() {
//   const url = process.env.BASE_API_URL || "http://localhost:3000/api";
//   return url.endsWith("/") ? url.slice(0, -1) : url; // Remove trailing slash
// }

// const axiosInstance = axios.create({
//   baseURL: getBaseUrl(),
//   withCredentials: true,
//   headers: {
//     "Content-Type": "Application/json",
//   },
// });

// ---------------------------

class AxiosFetcher {
  constructor() {}

  async get(url: string) {
    try {
    } catch (error) {
      if (typeof window === "undefined") {
      }

      return error;
    }

    const res = await axiosInstance.get(url);
    return res;
  }
  async post(url: string, data: Record<string, unknown>) {
    const res = await axiosInstance.post(url, { ...data });
    return res;
  }
  async put(url: string, data: Record<string, unknown>) {
    const res = await axiosInstance.put(url, { ...data });
    return res;
  }
  async patch(url: string, data: Record<string, unknown>) {
    const res = await axiosInstance.patch(url, { ...data });
    return res;
  }

  async delete(url: string, data: Record<string, unknown>) {
    const res = await axiosInstance.delete(url, { ...data });
    return res;
  }
  static init() {}
}
