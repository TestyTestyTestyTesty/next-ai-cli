import axios from "axios";

export const fetchTokenForTask = async (taskName: string) => {
  try {
    const response = await axios.get(`/api/get-token/${taskName}`);
    if (response.data.token) {
      return response.data.token;
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
