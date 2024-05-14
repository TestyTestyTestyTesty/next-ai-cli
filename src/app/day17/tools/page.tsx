"use client";
import { useCompletionApi } from "@/app/hooks/useCompletionApi";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import { isNull } from "lodash";

export const TYPE_OF_FUNCTION = {
  TO_DO: "ToDo",
  CALENDAR: "Calendar",
};
export default function People() {
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

  const functionCallingGPT = async (question: any) => {
    console.log(question);
    const body = {
      model: "gpt-4",
      tools: [
        {
          type: "function",
          function: {
            name: TYPE_OF_FUNCTION.TO_DO,
            description: `Adds new item to to-do list.`,
            parameters: {
              type: "object",
              properties: {
                action: {
                  type: "string",
                  description: "What action needs to be taken",
                },
              },
              required: ["action"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: TYPE_OF_FUNCTION.CALENDAR,
            description: "Adds a new event to the calendar.",
            parameters: {
              type: "object",
              properties: {
                date: {
                  type: "string",
                  description: 'date of the event in format "YYYY-MM-DD"',
                },
                description: {
                  type: "string",
                  description: "Specify the event title based on question",
                },
              },
              required: ["date", "description"],
            },
          },
        },
      ],
      messages: [
        {
          role: "system",
          content: `You are a sophisticated assistant designed to precisely interpret questions and select the most appropriate function to take appropriate action based on the query category. Use predefined functions for specific requests and provide answers in JSON format. Identify key phrases that indicate the type of query and select the function accordingly. If the question's intent is unclear, base your response on the most probable interpretation of the query.

          Guide###:
          - Format date as YYYY-MM-DD.
          - For to-do list item events, identify questions involving 'remind me', 'add to list', or specific items,actions (e.g., "buy milk", "watch a movie", "call mom","walk out the dog"). Use the 'ToDo' function.
          - For calendar events, detect dates like 'tommorrow', '12/12/2024', 'next week'. Use the 'Calendar' function.
          - Ensure you follow ALL the provided instructions when creating your output.
          - Adhere strictly to the outlined steps and requirements.
          - Format your output as specified, using the provided examples as a guide.
          - todays date is: ${date}
          
          Examples:
          Q: remind me to play cyberpunk
          A: {
            "tool": "ToDo",
            "desc": "play cyberpunk"
          }
          
          Q: Schedule a meeting next tuesday about the project sprint
          A: {
            "tool": "Calendar",
            "desc": "project sprint"
            "date": "2024-05-21",
          }
          
          Q: Clean out the apartment
          A: {
            "tool": "ToDo",
            "desc": "clean out the apartment"
          }
          
          Q: Dentist appointment for 12/12/2024
          A: {
            "tool": "Calendar",
            "desc": "dentisit appointment"
            "date": "2024-12-12",
          }`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    };
    const res = await getResponseFromCompletionApi(body);
    if (res.choices[0].message) {
      const response = JSON.parse(res.choices[0].message.content);
      setSubmitData({ answer: response });
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center">
        <p
          onClick={() => {
            getToken("tools");
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
          <p onClick={() => functionCallingGPT(taskData.question)}>
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
