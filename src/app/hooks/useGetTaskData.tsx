import { useCallback, useState } from "react";
import { fetchTaskData, requestMethod } from "../helpers/fetchTaskData";

export const useGetTaskData = () => {
  const [taskData, setTaskData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTaskData = useCallback(async (token: string) => {
    try {
      setIsLoading(true);
      const fetchedData = await fetchTaskData({
        token,
        method: requestMethod.GET,
      });
      if (fetchedData) {
        setTaskData(fetchedData);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { taskData, getTaskData, isLoading };
};
