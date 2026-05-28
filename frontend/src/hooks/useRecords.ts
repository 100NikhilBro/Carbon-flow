import {

  useEffect,
  useState,

} from "react";

import {

  getRecords,

  approveRecord,

  rejectRecord,

  exportCSV,

  exportExcel,

} from "../api/recordsApi";


export const useRecords = () => {

  const [records, setRecords] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [count, setCount] =
    useState(0);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [filters, setFilters] =
    useState({

      review_status: "",

      scope: "",

      is_flagged: "",

      search: "",
    });


  // FETCH RECORDS

  const fetchRecords =
    async () => {

      try {

        setLoading(true);

        setError("");

        const data =
          await getRecords({

            ...filters,

            page: currentPage,
          });

        setRecords(
          data.results || []
        );

        setCount(
          data.count || 0
        );

      } catch (error) {

        console.error(error);

        setError(
          "Failed to fetch records"
        );

      } finally {

        setLoading(false);
      }
    };


  // APPROVE

  const handleApprove =
    async (recordId: string) => {

      try {

        await approveRecord(
          recordId
        );

        fetchRecords();

      } catch (error) {

        console.error(error);
      }
    };


  // REJECT

  const handleReject =
    async (

      recordId: string,

      analyst_notes: string
    ) => {

      try {

        await rejectRecord(

          recordId,

          analyst_notes
        );

        fetchRecords();

      } catch (error) {

        console.error(error);
      }
    };


  // EXPORT CSV

  const handleExportCSV =
    async () => {

      try {

        const response =
          await exportCSV();

        const url =
          window.URL.createObjectURL(
            new Blob([response.data])
          );

        const link =
          document.createElement("a");

        link.href = url;

        link.setAttribute(
          "download",
          "esg_records.csv"
        );

        document.body.appendChild(
          link
        );

        link.click();

      } catch (error) {

        console.error(error);
      }
    };


  // EXPORT EXCEL

  const handleExportExcel =
    async () => {

      try {

        const response =
          await exportExcel();

        const url =
          window.URL.createObjectURL(
            new Blob([response.data])
          );

        const link =
          document.createElement("a");

        link.href = url;

        link.setAttribute(
          "download",
          "esg_records.xlsx"
        );

        document.body.appendChild(
          link
        );

        link.click();

      } catch (error) {

        console.error(error);
      }
    };


  useEffect(() => {

    fetchRecords();

  }, [filters, currentPage]);


  return {

    records,

    loading,

    error,

    count,

    currentPage,

    setCurrentPage,

    filters,

    setFilters,

    handleApprove,

    handleReject,

    handleExportCSV,

    handleExportExcel,
  };
};
