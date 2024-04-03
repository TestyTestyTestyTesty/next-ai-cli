import { useCallback, useState } from "react";
import { fetchTaskData, requestMethod } from "../helpers/fetchTaskData";
import { AxiosRequestConfig } from "axios";

export const usePostTaskData = () => {
  const [taskData, setTaskData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const postTaskData = useCallback(
    async (
      token: string,
      question: any,
      additionalHeaders?: AxiosRequestConfig<string>
    ) => {
      try {
        setIsLoading(true);
        const fetchedData = await fetchTaskData({
          token,
          body: question,
          method: requestMethod.POST,
          additionalHeaders,
        });
        if (fetchedData) {
          setTaskData(fetchedData);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { taskData, postTaskData, isLoading };
};
