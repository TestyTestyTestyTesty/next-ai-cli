"use client";
import { useCompletionApi } from "@/app/hooks/useCompletionApi";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import { isNull } from "lodash";
import { useEffect, useState } from "react";
import testJson from "./test.json";
const testJsonString = JSON.stringify(testJson);
const testData = [
  "Wstęp: kilka słów na temat historii pizzy",
  "Niezbędne składniki na pizzę",
  "Robienie pizzy",
  "Pieczenie pizzy w piekarniku",
];

export default function Moderation() {
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

  const testCompletionApi = async (data: any) => {
    const body = {
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "specjalizujesz sie pisaniu krótkich artykułów blogowych. user podaje liste sekcji, sekcje oddzielone są nową linią. Na podstawie nazw sekcji napisz rozwiniecie każdej. Max 3 zdania dla każdej sekcji. odpowiedz zwróc w formacie JSON. Nie dopisujesz nic od siebie.",
        },
        {
          role: "user",
          content: testData.join(",\n"),
        },
      ],
    };
    const res = await getResponseFromCompletionApi(body);
    if (res.choices[0].message.content) {
      console.log(res);
      transfromJsonToArray(res.choices[0].message.content);
    }
  };
  const transfromJsonToArray = (jsonFile: any) => {
    if (JSON.parse(jsonFile)) {
      const parsedJson = JSON.parse(jsonFile);
      const stringArray = Object.values(parsedJson);
      setSubmitData({ answer: stringArray });
    } else {
      console.log("wrong format");
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center">
        <p onClick={() => testCompletionApi(testData)}>
          completion on mock data
        </p>
        {isCompletionLoading && <Spinner />}
      </div>
      <div className="flex gap-4 items-center">
        <p onClick={() => getToken("blogger")}>fetch token</p>
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
          <p onClick={() => testCompletionApi(taskData.blog)}>
            get completion from chatgpt
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
