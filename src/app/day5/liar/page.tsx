"use client";
import { customHeadersWwwFromUrlEncoded } from "@/app/helpers/customHeaders";
import { useCompletionApi } from "@/app/hooks/useCompletionApi";
import { useGetToken } from "@/app/hooks/useGetToken";
import { usePostTaskData } from "@/app/hooks/usePostTaskData";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import { isNull } from "lodash";
import testJson from "./test.json";
import { useEffect, useState } from "react";

const testAnswer =
  "Despite the controversy, Hawaiian pizza remains one of the top-selling pizzas worldwide.";
const testAnswerTrue = "Warsaw is the capitol of poland";
export default function Liar() {
  const { token, getToken, isLoading: isTokenLoading } = useGetToken();
  const [guardrailAnswer, setGuardrailAnswer] = useState<null | string>(null);
  const { getResponseFromCompletionApi, isLoading: isCompletionLoading } =
    useCompletionApi();

  const {
    taskData,
    postTaskData,
    isLoading: isTaskDataLoading,
  } = usePostTaskData();

  const {
    submitTask,
    setSubmitData,
    submitData,
    submitResponse,
    isLoading: isSubmitting,
  } = useSubmitTask();

  const guardRailAnswer = async (question: string, answer: string) => {
    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are returning YES or NO. You're checking if the answer: ${answer} can be considered on topic of prompt: ${question}`,
        },
      ],
    };
    const res = await getResponseFromCompletionApi(body);
    if (res.choices[0].message.content) {
      setGuardrailAnswer(res.choices[0].message.content);
    }
  };

  useEffect(() => {
    if (!isNull(guardrailAnswer)) {
      setSubmitData({ answer: guardrailAnswer });
    }
  }, [guardrailAnswer, setSubmitData]);

  return (
    <>
      <div className="flex gap-4 items-center">
        <p onClick={() => guardRailAnswer(testJson.question, testAnswerTrue)}>
          test guardrail on test data
        </p>
        {isCompletionLoading && <Spinner />}
      </div>
      <div className="flex gap-4 items-center">
        <p onClick={() => getToken("liar")}>fetch token</p>
        {isTokenLoading && <Spinner />}
      </div>
      {token && (
        <div className="flex gap-4 items-center">
          <p
            onClick={() =>
              postTaskData(token, testJson, customHeadersWwwFromUrlEncoded)
            }
          >
            get task data
          </p>
          {isTaskDataLoading && <Spinner />}
        </div>
      )}
      {taskData && (
        <div className="flex gap-4 items-center">
          <p
            onClick={() => guardRailAnswer(testJson.question, taskData.answer)}
          >
            guardrail an answer from GPT
          </p>
          {isCompletionLoading && <Spinner />}
        </div>
      )}
      {submitData && (
        <div className="flex gap-4 items-center">
          {guardrailAnswer}
          <p onClick={() => submitTask(token, submitData)}>Submit task</p>
          {isSubmitting && <Spinner />}
        </div>
      )}
      {!isNull(submitResponse) && <p>{JSON.stringify(submitResponse)}</p>}
    </>
  );
}
