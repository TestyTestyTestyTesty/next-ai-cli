"use client";
import { useCompletionApi } from "@/app/hooks/useCompletionApi";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import { isNull } from "lodash";

export default function Gnome() {
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

  const functionCallingGPT = async (url: string) => {
    const body = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `User will input an image which should have an image depicting gnome.
          If image does'nt depict gnome return 'error'
          If image depicts gnome return only the color of the hat he is wearing in Polish
          If gnome does not have a hat return 'error'
          example:
          if gnome has red hat return: 'czerwony'
          if gnome has blue hat return: 'niebieski'
          `,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Whats in this image?" },
            {
              type: "image_url",
              image_url: {
                url: url,
              },
            },
          ],
        },
      ],
    };
    const res = await getResponseFromCompletionApi(body);
    if (res.choices[0].message) {
      const response = res.choices[0].message.content;
      setSubmitData({ answer: response });
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center">
        <p
          onClick={() => {
            getToken("gnome");
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
          <p onClick={() => functionCallingGPT(taskData.url)}>
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
