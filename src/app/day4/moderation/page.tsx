"use client";
import { useCheckDataInModerationApi } from "@/app/hooks/useCheckDataInModerationApi";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import { isNull } from "lodash";
import { useEffect, useState } from "react";

const testData = [
  "ten gość musi zginąć. Nie pozwole sobię na obrażanie mnie.",
  "azjaci są głupi i brzydcy i nie powinni żyć",
  "Sasha.Grey.s3x.p0rn.extreme-interracial.S03E12.DVDRip.mp4",
  "majonez Winiary jest lepszy od Kieleckiego",
];

export default function Moderation() {
  const { token, getToken, isLoading: isTokenLoading } = useGetToken();
  const {
    taskData,
    getTaskData,
    isLoading: isTaskDataLoading,
  } = useGetTaskData();
  const [transformedResponse, setTransformedResponse] = useState<any>(null);
  const {
    submitTask,
    setSubmitData,
    submitData,
    submitResponse,
    isLoading: isSubmitting,
  } = useSubmitTask();
  const { getResponseFromModerationApi, isLoading: isModerationApiLoading } =
    useCheckDataInModerationApi();

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
        <div className="flex gap-4 items-center">
          <p onClick={() => checkDataInModerationApi(taskData.input)}>
            Check input in moderation API
          </p>
          {isModerationApiLoading && <Spinner />}
        </div>
      )}
      {transformedResponse && (
        <div className="flex gap-4 items-center">
          <p onClick={() => submitTask(token, submitData)}>Submit task</p>
          {isSubmitting && <Spinner />}
        </div>
      )}
      {!isNull(submitResponse) && <p>{JSON.stringify(submitResponse)}</p>}
    </>
  );
}
