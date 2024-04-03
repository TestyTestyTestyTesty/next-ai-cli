import axios from "axios";
import { customHeadersJson } from "../helpers/customHeaders";
import { useState } from "react";

export const useCompletionApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const getResponseFromCompletionApi = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        data,
        customHeadersJson
      );
      if (response.data) {
        return response.data;
      } else {
        throw new Error(response.data.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.message);
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { getResponseFromCompletionApi, isLoading };
};
