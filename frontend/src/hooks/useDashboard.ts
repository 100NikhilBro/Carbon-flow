import {

  useEffect,
  useState,

} from "react";

import {

  getDashboardSummary,
  getEmissionsByScope,
  getReviewStatus,
  getFlaggedRecords,

} from "../api/dashboardApi";


export const useDashboard = () => {

  const [summary, setSummary] =
    useState(null);

  const [scopeData, setScopeData] =
    useState([]);

  const [reviewData, setReviewData] =
    useState([]);

  const [flaggedRecords, setFlaggedRecords] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const fetchDashboardData =
    async () => {

      try {

        setLoading(true);

        const [

          summaryRes,

          scopeRes,

          reviewRes,

          flaggedRes,

        ] = await Promise.all([

          getDashboardSummary(),

          getEmissionsByScope(),

          getReviewStatus(),

          getFlaggedRecords(),
        ]);

        setSummary(summaryRes);

        setScopeData(scopeRes);

        setReviewData(reviewRes);

        setFlaggedRecords(flaggedRes);

      } catch (error) {

        setError(
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchDashboardData();

  }, []);

  return {

    summary,

    scopeData,

    reviewData,

    flaggedRecords,

    loading,

    error,
  };
};