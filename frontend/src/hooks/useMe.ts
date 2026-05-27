import {
  useEffect,
  useState,
} from "react";

import { getMe } from "../api/authApi";


export const useMe = () => {

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const fetchMe =
    async () => {

      try {

        setLoading(true);

        const data =
          await getMe();

        setUser(data);

      } catch (error) {

        console.error(error);

        setError(
          "Failed to load profile"
        );

      } finally {

        setLoading(false);
      }
    };


  useEffect(() => {

    fetchMe();

  }, []);


  return {

    user,

    loading,

    error,
  };
};