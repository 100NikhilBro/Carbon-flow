// hooks/useRecords.ts
import { useEffect, useState } from "react";
import {
  getRecords,
  approveRecord,
  rejectRecord,
  exportCSV,
  exportExcel,
} from "../api/recordsApi";

export const useRecords = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Server‑side sorting state
  const [sortField, setSortField] = useState("occurred_on");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [filters, setFilters] = useState({
    review_status: "",
    scope: "",
    is_flagged: "",
    search: "",
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");
      const ordering =
        sortDirection === "desc" ? `-${sortField}` : sortField;
      const data = await getRecords({
        ...filters,
        page: currentPage,
        ordering, // e.g. "-co2e_emissions" or "co2e_emissions"
      });
      setRecords(data.results || []);
      setCount(data.count || 0);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (recordId: string) => {
    try {
      await approveRecord(recordId);
      fetchRecords();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (recordId: string, analyst_notes: string) => {
    try {
      await rejectRecord(recordId, analyst_notes);
      fetchRecords();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "esg_records.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await exportExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "esg_records.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [filters, currentPage, sortField, sortDirection]);

  return {
    records,
    loading,
    error,
    count,
    currentPage,
    setCurrentPage,
    filters,
    setFilters,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    handleApprove,
    handleReject,
    handleExportCSV,
    handleExportExcel,
  };
};
