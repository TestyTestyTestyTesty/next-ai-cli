import axios from "axios";
import { customHeadersJson } from "../helpers/customHeaders";
import { useState } from "react";

export const useEmbeddingsApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const getResponseFromEmbeddingsApi = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://api.openai.com/v1/embeddings",
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
  return { getResponseFromEmbeddingsApi, isLoading };
};
