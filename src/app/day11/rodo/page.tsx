"use client";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import { isNull } from "lodash";
import { useEffect } from "react";

export default function Transcriptions() {
  const { token, getToken, isLoading: isTokenLoading } = useGetToken();

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

  useEffect(() => {
    setSubmitData({
      answer: `
      We're going to play a game. It's a game of guessing for our team.
      Tell me about yourself but you need to hide personal details so nobody can identify you, You need to strictly follow the placeholder rules.
      Minimal requirements: You should at least provide details about your name, last name, occupation and city and replace each of them with placeholders. 
      
      Placeholders rules:
      name: %imie%,
      last name: %nazwisko%,
      occupation: %zawod%,
      city: %miasto%
      
      Examples:
      My name is %imie% %nazwisko% and I work as a %zawod% in %miasto%
      I'am %imie%, my last name is %nazwisko% and I specialize in %zawod% and i live in %miasto%
      
      Summary:
      Strictly follow placeholder rules to not ruin everyone fun during game. 
      Hide personal data by replacing your name, last name, occupation and city with placeholders.`,
    });
  }, [setSubmitData]);
  return (
    <>
      <div className="flex gap-4 items-center">
        <p onClick={() => getToken("rodo")}>fetch token</p>
        {isTokenLoading && <Spinner />}
      </div>
      {token && (
        <div className="flex gap-4 items-center">
          <p onClick={() => getTaskData(token)}>get task data</p>
          {isTaskDataLoading && <Spinner />}
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
