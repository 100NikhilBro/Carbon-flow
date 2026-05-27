import axiosInstance from "./axios";


export const uploadFile =
  async (

    formData: FormData
  ) => {

    const response =
      await axiosInstance.post(

        "/uploads/upload/",

        formData,

        {
          headers: {

            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return response.data;
};