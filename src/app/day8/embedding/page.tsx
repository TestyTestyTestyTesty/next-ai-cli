"use client";
import { useEmbeddingsApi } from "@/app/hooks/useEmbeddingsApi";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import { isNull } from "lodash";

export default function Inprompt() {
  const { token, getToken, isLoading: isTokenLoading } = useGetToken();
  const { getResponseFromEmbeddingsApi, isLoading: isCompletionLoading } =
    useEmbeddingsApi();

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

  const embedString = async (input: string) => {
    const body = {
      model: "text-embedding-ada-002",
      input,
    };
    const res = await getResponseFromEmbeddingsApi(body);
    if (res.data[0].embedding) {
      setSubmitData({ answer: res.data[0].embedding });
    }
  };
  return (
    <>
      <div className="flex gap-4 items-center">
        <p onClick={() => getToken("embedding")}>fetch token</p>
        {isTokenLoading && <Spinner />}
      </div>
      {token && (
        <div className="flex gap-4 items-center">
          <p onClick={() => getTaskData(token)}>get task data</p>
          {isTaskDataLoading && <Spinner />}
        </div>
      )}
      {taskData && (
        <div className="flex gap-4 items-center">
          <p onClick={() => embedString("Hawaiian pizza")}>Embed string</p>
          {isCompletionLoading && <Spinner />}
        </div>
      )}
      {submitData && (
        <div className="flex gap-4 items-center">
          <p onClick={() => submitTask(token, submitData)}>Submit task</p>
          {isSubmitting && <Spinner />}
        </div>
      )}
      {!isNull(submitResponse) && <p>{JSON.stringify(submitResponse)}</p>}
    </>
  );
}
