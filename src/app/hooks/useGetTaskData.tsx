import { useCallback, useState } from "react";
import { fetchTaskData } from "../helpers/fetchTaskData";
interface TaskData {
  code: number;
  msg: string;
  cookie: string;
}
export const useGetTaskData = () => {
  const [taskData, setTaskData] = useState<TaskData | null>(null);

  const getTaskData = useCallback(async (token: string) => {
    try {
      const fetchedData = await fetchTaskData(token);
      if (fetchedData) {
        setTaskData(fetchedData);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return { taskData, getTaskData };
};
