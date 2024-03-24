"use client";
import { fetchTaskData } from "@/app/helpers/fetchTaskData";
import { fetchTokenForTask } from "@/app/helpers/fetchTokenForTask";
import { useEffect, useState } from "react";
import { submitAnswer } from "../helpers/submitAnswer";
interface submitData {
  answer: string;
}
interface TaskData {
  code: number;
  msg: string;
  cookie: string;
}
export default function HelloApi() {
  const [token, setToken] = useState("");
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [submitData, setSubmitData] = useState<submitData | null>(null);

  const getToken = async (task: string) => {
    try {
      const fetchedToken = await fetchTokenForTask(task);
      if (fetchedToken) {
        setToken(fetchedToken);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getTaskData = async (token: string) => {
    try {
      const fetchedData = await fetchTaskData(token);
      if (fetchedData) {
        setTaskData(fetchedData);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const submitTask = async (token: string, data: any) => {
    if (!token || !data) return;
    try {
      console.log(data);
      const response = await submitAnswer(token, data);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (taskData) {
      setSubmitData({
        answer: taskData.cookie,
      });
    }
  }, [taskData]);
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
