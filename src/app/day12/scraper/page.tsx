"use client";
import { useCompletionApi } from "@/app/hooks/useCompletionApi";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import axios from "axios";
import { isNull } from "lodash";
import { useEffect, useState } from "react";
const testData = {
  question: "komu przypisuje się przepis na danie lagana?",
  url: "https://tasks.aidevs.pl/text_pasta_history.txt",
};
export default function Scraper() {
  const [scrapedData, setScrapedData] = useState<null | string>(null);
  const { getResponseFromCompletionApi, isLoading: isCompletionLoading } =
    useCompletionApi();
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

  const scrapeUrl = async (url: string) => {
    const tempUrl = "https://tasks.aidevs.pl/text_pizza_history.txt";
    try {
      console.log("fetching");
      const response = await axios.get(
        `/api/scrape-url/${encodeURIComponent(tempUrl)}`
      );
      if (response.data) {
        setScrapedData(response.data);
      } else {
        throw new Error(response.data.msg);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.message);
      } else {
        console.error(error);
      }
    } finally {
      console.log("finished");
    }
  };

  const answerFromScrapedContent = async (
    question: string,
    systemMessage: string,
    data: string
  ) => {
    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${systemMessage}
          ##
          context: ${data}
          ##
          `,
        },
        {
          role: "user",
          content: question,
        },
      ],
    };
    const res = await getResponseFromCompletionApi(body);
    if (res.choices[0].message.content) {
      setSubmitData({ answer: res.choices[0].message.content });
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center">
        <p onClick={() => getToken("scraper")}>fetch token</p>
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
          <p onClick={() => scrapeUrl(taskData.input)}>scrape website</p>
        </div>
      )}
      {scrapedData && (
        <div className="flex gap-4 items-center">
          <p
            onClick={() =>
              answerFromScrapedContent(
                taskData.question,
                taskData.msg,
                scrapedData
              )
            }
          >
            get an answer to the question
          </p>
          {isCompletionLoading && <Spinner />}
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
