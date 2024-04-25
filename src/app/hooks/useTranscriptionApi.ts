import axios from "axios";
import { useState } from "react";
import { customHeadersMultipart } from "../helpers/customHeaders";

export const useTranscriptionApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const getResponseFromTranscriptionApi = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        data,
        customHeadersMultipart
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
  return { getResponseFromTranscriptionApi, isLoading };
};
