import axios from "axios";
import { customHeaders } from "../helpers/customHeader";
import { useState } from "react";

export const useCheckDataInModerationApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const getResponseFromModerationApi = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://api.openai.com/v1/moderations",
        { input: data },
        customHeaders
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
  return { getResponseFromModerationApi, isLoading };
};
