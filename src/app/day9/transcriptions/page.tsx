"use client";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { useTranscriptionApi } from "@/app/hooks/useTranscriptionApi";
import { Spinner } from "@/app/modules/Spinner";
import { isNull } from "lodash";
import { FormEvent, useState } from "react";
export default function Transcriptions() {
  const [selectedFile, setSelectedFile] = useState(null);
  const { token, getToken, isLoading: isTokenLoading } = useGetToken();
  const { getResponseFromTranscriptionApi, isLoading: isCompletionLoading } =
    useTranscriptionApi();

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

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

  const transcriptAudio = async () => {
    const body = {
      model: "whisper-1",
      file: selectedFile,
    };
    const res = await getResponseFromTranscriptionApi(body);
    console.log(res);
    if (res.text) {
      setSubmitData({ answer: res.text });
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center">
        <p onClick={() => getToken("whisper")}>fetch token</p>
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
          <input type="file" onChange={handleFileChange} />
        </div>
      )}
      {selectedFile && (
        <div className="flex gap-4 items-center">
          <p onClick={transcriptAudio}>Transcript audio</p>
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
