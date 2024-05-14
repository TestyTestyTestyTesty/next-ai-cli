"use client";
import { useCompletionApi } from "@/app/hooks/useCompletionApi";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import axios from "axios";
import { isNull } from "lodash";

export default function Meme() {
  console.log(process.env.NEXT_PUBLIC_RENDERFORM_API);
  const { getResponseFromCompletionApi } = useCompletionApi();
  const { token, getToken, isLoading: isTokenLoading } = useGetToken();
  const date = new Date().toLocaleDateString();
  const {
    taskData,
    getTaskData,
    isLoading: isTaskDataLoading,
  } = useGetTaskData();

  const {
    submitTask,
    setSubmitData,
    submitData,
    submitResponse,
    isLoading: isSubmitting,
  } = useSubmitTask();

  const generateMeme = async (imgUrl: string, text: string) => {
    try {
      const response = await axios.post(
        "https://get.renderform.io/api/v2/render",
        {
          template: "little-falcons-laugh-clearly-1796",
          data: {
            "meme-image.src": imgUrl,
            "meme-title.text": text,
          },
        },
        {
          headers: {
            "X-API-KEY": process.env.NEXT_PUBLIC_RENDERFORM_API,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        setSubmitData({ answer: response.data.href });
      } else {
        throw new Error("error");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.message);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center">
        <p
          onClick={() => {
            getToken("meme");
          }}
        >
          fetch token
        </p>
        {isTokenLoading && <Spinner />}
      </div>
      {token && (
        <div className="flex gap-4 items-center">
          <p onClick={() => getTaskData(token)}>get task data</p>
          {isTaskDataLoading && <Spinner />}
        </div>
      )}
      {taskData && (
        <div className="flex-col gap-4 items-center">
          <p onClick={() => generateMeme(taskData.image, taskData.text)}>
            function calling
          </p>
        </div>
      )}
      {taskData && submitData && (
        <div className="flex gap-4 items-center">
          <p onClick={() => submitTask(token, submitData)}>Submit task</p>
          {isSubmitting && <Spinner />}
        </div>
      )}
      {!isNull(submitResponse) && <p>{JSON.stringify(submitResponse)}</p>}
    </>
  );
}
