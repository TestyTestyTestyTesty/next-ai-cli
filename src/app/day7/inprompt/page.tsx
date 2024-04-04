"use client";
import { useCompletionApi } from "@/app/hooks/useCompletionApi";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import { isNull } from "lodash";

export default function Inprompt() {
  const { token, getToken, isLoading: isTokenLoading } = useGetToken();
  const { getResponseFromCompletionApi, isLoading: isCompletionLoading } =
    useCompletionApi();

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

  const findAnswer = async (context: any, question: string) => {
    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Answer user question. context: ${context}`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    };
    const res = await getResponseFromCompletionApi(body);
    if (res.choices[0].message.content) {
      setSubmitData({ answer: res.choices[0].message.content });
    }
  };
  return (
    <>
      <div className="flex gap-4 items-center">
        <p onClick={() => getToken("inprompt")}>fetch token</p>
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
          <p onClick={() => findAnswer(taskData.input, taskData.question)}>
            Find an answer to the question
          </p>
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
