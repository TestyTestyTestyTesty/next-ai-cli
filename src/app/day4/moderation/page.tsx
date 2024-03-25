"use client";
import { customHeaders } from "@/app/helpers/customHeader";
import { useCheckDataInModerationApi } from "@/app/hooks/useCheckDataInModerationApi";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";

const testData = [
  "ten gość musi zginąć. Nie pozwole sobię na obrażanie mnie.",
  "azjaci są głupi i brzydcy i nie powinni żyć",
  "Sasha.Grey.s3x.p0rn.extreme-interracial.S03E12.DVDRip.mp4",
  "majonez Winiary jest lepszy od Kieleckiego",
];

export default function Categorizer() {
  const { token, getToken, isLoading: isTokenLoading } = useGetToken();
  const {
    taskData,
    getTaskData,
    isLoading: isTaskDataLoading,
  } = useGetTaskData();
  const [transformedResponse, setTransformedResponse] = useState<any>(null);
  const { submitTask, setSubmitData, submitData } = useSubmitTask();
  const { getResponseFromModerationApi } = useCheckDataInModerationApi();

  const checkTestDataInModerationApi = async () => {
    const res = await getResponseFromModerationApi(testData);
    console.log(res);
  };

  const checkDataInModerationApi = async (data: any) => {
    const res = await getResponseFromModerationApi(data);
    if (res.results) {
      setTransformedResponse(
        res.results.map((item: any) => (item.flagged ? 1 : 0))
      );
    }
  };

  useEffect(() => {
    if (transformedResponse) {
      setSubmitData({ answer: transformedResponse });
    }
  }, [setSubmitData, taskData, transformedResponse]);

  return (
    <>
      <p onClick={checkTestDataInModerationApi}>
        check input in moderation api on test data
      </p>
      <div className="flex gap-4 items-center">
        <p onClick={() => getToken("moderation")}>fetch token</p>
        {isTokenLoading && <Spinner />}
      </div>
      {token && (
        <div className="flex gap-4 items-center">
          <p onClick={() => getTaskData(token)}>get task data</p>
          {isTaskDataLoading && <Spinner />}
        </div>
      )}
      {taskData && (
        <p onClick={() => checkDataInModerationApi(taskData.input)}>
          Check input in moderation API
        </p>
      )}
      {transformedResponse && (
        <p onClick={() => submitTask(token, submitData)}>Submit task</p>
      )}
    </>
  );
}
