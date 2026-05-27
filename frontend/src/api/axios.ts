import axios from "axios";

const axiosInstance = axios.create({

  baseURL:
    "https://carbon-flow-kyb4.onrender.com/api",

  headers: {

    "Content-Type":
      "application/json",
  },
});


// =========================
// REQUEST INTERCEPTOR
// =========================

axiosInstance.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem(
        "access_token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);


// =========================
// RESPONSE INTERCEPTOR
// =========================

axiosInstance.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;


    // ACCESS TOKEN EXPIRED

    if (

      error.response?.status === 401 &&

      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem(
            "refresh_token"
          );

        // REQUEST NEW ACCESS TOKEN

        const response =
          await axios.post(

            "https://carbon-flow-kyb4.onrender.com/api/auth/refresh/",

            {
              refresh:
                refreshToken,
            }
          );

        const newAccessToken =
          response.data.access;

        // SAVE NEW TOKEN

        localStorage.setItem(

          "access_token",

          newAccessToken
        );

        // UPDATE HEADER

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        // RETRY ORIGINAL REQUEST

        return axiosInstance(
          originalRequest
        );

      } catch (refreshError) {

        console.error(
          "Refresh token expired"
        );

        // CLEAR TOKENS

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "refresh_token"
        );

        // REDIRECT LOGIN

        window.location.href =
          "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
