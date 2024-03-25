import { useCallback, useState } from "react";
import { fetchTaskData } from "../helpers/fetchTaskData";
import { submitAnswer } from "../helpers/submitAnswer";
interface submitData {
  answer: any;
}
export const useSubmitTask = () => {
  const [submitData, setSubmitData] = useState<submitData | null>(null);

  const submitTask = useCallback(async (token: string, data: any) => {
    if (!token || !data) return;
    try {
      const response = await submitAnswer(token, data);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return { submitData, setSubmitData, submitTask };
};
