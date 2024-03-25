"use client";
import { fetchTaskData } from "@/app/helpers/fetchTaskData";
import { fetchTokenForTask } from "@/app/helpers/fetchTokenForTask";
import { useEffect, useState } from "react";
import { submitAnswer } from "../helpers/submitAnswer";
import { useGetToken } from "../hooks/useGetToken";
import { useGetTaskData } from "../hooks/useGetTaskData";
import { useSubmitTask } from "../hooks/useSubmitTask";

export default function HelloApi() {
  const { token, getToken } = useGetToken();
  const { taskData, getTaskData } = useGetTaskData();
  const { submitTask, setSubmitData, submitData } = useSubmitTask();

  useEffect(() => {
    if (taskData) {
      setSubmitData({
        answer: taskData.cookie,
      });
    }
  }, [setSubmitData, taskData]);

  return (
    <>
      <p onClick={() => getToken("helloapi")}>fetch token</p>
      {token && (
        <>
          <p>token fetched: {token}</p>
          <p onClick={() => getTaskData(token)}>get task data</p>
        </>
      )}
      {taskData && (
        <>
          <p>task data: {JSON.stringify(taskData)}</p>
          <p onClick={() => submitTask(token, submitData)}>Submit task</p>
        </>
      )}
    </>
  );
}
