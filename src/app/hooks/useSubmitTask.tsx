import { useCallback, useState } from "react";
import { fetchTaskData } from "../helpers/fetchTaskData";
import { submitAnswer } from "../helpers/submitAnswer";
interface submitData {
  answer: string;
}
export const useSubmitTask = () => {
  const [submitData, setSubmitData] = useState<submitData | null>(null);

  const submitTask = useCallback(async (token: string, data: any) => {
    if (!token || !data) return;
    try {
      console.log(data);
      const response = await submitAnswer(token, data);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return { submitData, setSubmitData, submitTask };
};
