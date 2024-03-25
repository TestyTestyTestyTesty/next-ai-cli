import { fetchTokenForTask } from "@/app/helpers/fetchTokenForTask";
import { useCallback, useState } from "react";

export const useGetToken = () => {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const getToken = useCallback(async (taskname: string) => {
    try {
      setIsLoading(true);
      const fetchedToken = await fetchTokenForTask(taskname);
      setToken(fetchedToken);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { token, getToken, isLoading };
};
