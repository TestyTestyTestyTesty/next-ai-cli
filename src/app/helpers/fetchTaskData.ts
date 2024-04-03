import axios, { AxiosRequestConfig } from "axios";

export enum requestMethod {
  GET = "GET",
  POST = "POST",
}
interface fetchTaskData {
  token: string;
  method: requestMethod;
  body?: string;
  additionalHeaders?: AxiosRequestConfig<string>;
}

export const fetchTaskData = async ({
  token,
  method,
  body,
  additionalHeaders,
}: fetchTaskData) => {
  try {
    if (method === requestMethod.GET) {
      const response = await axios.get(`/api/get-task-data/${token}`);
      if (response.data) {
        return response.data;
      } else {
        throw new Error(response.data.msg);
      }
    }
    if (method === requestMethod.POST) {
      const response = await axios.post(
        `/api/get-task-data/${token}`,
        JSON.stringify(body),
        additionalHeaders
      );
      if (response.data) {
        return response.data;
      } else {
        throw new Error(response.data.msg);
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.message);
    } else {
      console.error(error);
    }
  }
};
