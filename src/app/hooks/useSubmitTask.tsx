import { useCallback, useState } from "react";
import { submitAnswer } from "../helpers/submitAnswer";
interface submitData {
  answer: any;
}
export const useSubmitTask = () => {
  const [submitData, setSubmitData] = useState<submitData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitResponse, setSubmitResponse] = useState<any>(null);
  const submitTask = useCallback(async (token: string, data: any) => {
    if (!token || !data) return;
    try {
      setIsLoading(true);
      const res = await submitAnswer(token, data);
      console.log(res);
      if (res) {
        setSubmitResponse(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { submitData, submitResponse, setSubmitData, submitTask, isLoading };
};
