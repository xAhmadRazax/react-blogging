import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.BASE_API_URL || "http://localhost:3000/api/",
  // withCredentials: true,
  headers: {
    "Content-Type": "Application/json",
  },
});

// axiosInstance.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     // If 401 and not retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // prevent infinite loop

//       try {
//         // Try refresh
//         await axios.post("/auth/refresh", {}, { withCredentials: true });

//         // Retry original request
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         // Refresh failed → logout
//         // TODO: add redirection here
//         console.log("Session expired, redirecting to login...");
//         // e.g. window.location.href = "/login";
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

export { axiosInstance as axios };
