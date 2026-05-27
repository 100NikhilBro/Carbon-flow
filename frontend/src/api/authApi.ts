import axiosInstance from "./axios";

interface LoginData {

  username: string;

  password: string;
}

export const loginUser = async (
  data: LoginData
) => {

  const response =
    await axiosInstance.post(

      "/auth/login/",
      data
    );

  return response.data;
};



export const getMe =
  async () => {

    const response =
      await axiosInstance.get(
        "/auth/me/"
      );

    return response.data;
};