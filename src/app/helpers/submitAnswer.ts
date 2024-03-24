import axios from "axios";

export const submitAnswer = async (token: string, data: any) => {
  try {
    const response = await axios.post(`/api/submit-task/${token}`, data);
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
  }
};
