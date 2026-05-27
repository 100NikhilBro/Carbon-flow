import axiosInstance from "./axios";


// SUMMARY

export const getDashboardSummary =
  async () => {

    const response =
      await axiosInstance.get(

        "/dashboard/summary/"
      );

    return response.data;
};


// EMISSIONS BY SCOPE

export const getEmissionsByScope =
  async () => {

    const response =
      await axiosInstance.get(

        "/dashboard/emissions-by-scope/"
      );

    return response.data;
};


// REVIEW STATUS

export const getReviewStatus =
  async () => {

    const response =
      await axiosInstance.get(

        "/dashboard/review-status/"
      );

    return response.data;
};


// FLAGGED RECORDS

export const getFlaggedRecords =
  async () => {

    const response =
      await axiosInstance.get(

        "/dashboard/flagged-records/"
      );

    return response.data;
};