import axiosInstance from "./axios";


// GET RECORDS

export const getRecords = async (
  params?: any
) => {

  const response =
    await axiosInstance.get(

      "/esg/records/",

      {
        params,
      }
    );

  return response.data;
};


// APPROVE RECORD

export const approveRecord =
  async (recordId: string) => {

    const response =
      await axiosInstance.post(

        `/esg/${recordId}/approve/`
      );

    return response.data;
};


// REJECT RECORD

export const rejectRecord =
  async (

    recordId: string,

    analyst_notes: string
  ) => {

    const response =
      await axiosInstance.post(

        `/esg/${recordId}/reject/`,

        {
          analyst_notes,
        }
      );

    return response.data;
};


// EXPORT CSV

export const exportCSV =
  async () => {

    const response =
      await axiosInstance.get(

        "/esg/export/csv/",

        {
          responseType: "blob",
        }
      );

    return response;
};


// EXPORT EXCEL

export const exportExcel =
  async () => {

    const response =
      await axiosInstance.get(

        "/esg/export/excel/",

        {
          responseType: "blob",
        }
      );

    return response;
};