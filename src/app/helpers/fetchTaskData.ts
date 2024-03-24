import axios, { AxiosError } from "axios";

export const fetchTaskData = async (token: string) => {
  try {
    const response = await axios.get(`/api/get-task-data/${token}`);
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
