import { useState } from "react";

import { uploadFile } from "../api/uploadApi";


export const useUpload = () => {

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");


  const handleUpload =
    async (

      file: File,

      sourceType: string
    ) => {

      try {

        setLoading(true);

        setSuccess("");

        setError("");

        const formData =
          new FormData();

        // FILE

        formData.append(
          "file",
          file
        );

        // SOURCE TYPE

        formData.append(

          "source_type",

          sourceType.toLowerCase()
        );

        const response =
          await uploadFile(
            formData
          );

        setSuccess(
          "File uploaded successfully"
        );

        return response;

      } catch (error: any) {

        console.error(error);

        setError(

          error?.response?.data?.error ||

          "Upload failed"
        );

      } finally {

        setLoading(false);
      }
    };


  return {

    loading,

    success,

    error,

    handleUpload,
  };
};