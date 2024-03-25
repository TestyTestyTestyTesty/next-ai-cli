import { useCallback, useState } from "react";
import { fetchTaskData } from "../helpers/fetchTaskData";

export const useGetTaskData = () => {
  const [taskData, setTaskData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTaskData = useCallback(async (token: string) => {
    try {
      setIsLoading(true);
      const fetchedData = await fetchTaskData(token);
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
