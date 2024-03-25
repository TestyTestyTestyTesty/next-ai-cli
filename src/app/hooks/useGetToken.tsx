import { useState, useCallback, useEffect } from "react";
import { fetchTokenForTask } from "@/app/helpers/fetchTokenForTask";

export const useGetToken = () => {
  const [token, setToken] = useState("");

  const getToken = useCallback(async (taskname: string) => {
    try {
      const fetchedToken = await fetchTokenForTask(taskname);
      setToken(fetchedToken);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { token, getToken };
};
