"use client";
import { useCompletionApi } from "@/app/hooks/useCompletionApi";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import axios from "axios";
import { isEmpty, isNil, isNull } from "lodash";
import { useState } from "react";

interface person {
  imie: string;
  nazwisko: string;
  o_mnie: string;
  ulubiona_postac_z_kapitana_bomby: string;
  ulubiony_film: string;
  ulubiony_kolor: string;
  ulubiony_serial: string;
  wiek: number;
}
interface fullName {
  imie: string;
  nazwisko: string;
}
export default function People() {
  const [jsonData, setJsonData] = useState<person[]>([]);
  const [fullName, setFullName] = useState<null | fullName>(null);
  const [personDetails, setPersonDetails] = useState<person | null>(null);
  const { getResponseFromCompletionApi } = useCompletionApi();
  const { token, getToken, isLoading: isTokenLoading } = useGetToken();

  const {
    taskData,
    getTaskData,
    isLoading: isTaskDataLoading,
  } = useGetTaskData();

  const fetchJson = async (url: string) => {
    try {
      const response = await axios.get(
        `/api/get-json/${encodeURIComponent(url)}`
      );
      if (response) {
        setJsonData(response.data);
      } else {
        throw new Error("error");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.message);
      } else {
        console.error(error);
      }
    }
  };

  const getFullName = async (question: any) => {
    const body = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Zwróć tylko imię i nazwisko w mianowniku z pytania użytkownika.
          Gdy imię jest zdrobnione np Piotruś zwróć pełną formalną formę Piotr
          zwróc w formacie JSON.
            Przykład:
            Najlepszy kolega Piotrka Szpaka to?
            { "imie": "Piotr", "nazwisko": "Szpak" }`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    };
    const res = await getResponseFromCompletionApi(body);
    if (res.choices[0].message.content) {
      setFullName(JSON.parse(res.choices[0].message.content));
    }
  };

  const answerQuestion = async (personDetails: any) => {
    const shortDescription = `jestem ${personDetails.imie} ${personDetails.nazwisko}, ${personDetails.o_mnie}, moj ulubiony kolor to: ${personDetails.ulubiony_kolor}`;
    const body = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `odpowiedz na pytanie użytkownika,
          ###
          kontekst:
          ${shortDescription}
          ###`,
        },
        {
          role: "user",
          content: taskData.question,
        },
      ],
    };
    const res = await getResponseFromCompletionApi(body);
    if (res.choices[0].message.content) {
      setSubmitData({ answer: res.choices[0].message.content });
    }
  };

  const findMatchingPeople = () => {
    if (!isNil(fullName) && fullName.imie && fullName.nazwisko) {
      const matchingPeople = jsonData.filter(
        (person) =>
          person.imie === fullName.imie && person.nazwisko === fullName.nazwisko
      );
      if (matchingPeople.length === 1) {
        setPersonDetails(matchingPeople[0]);
      } else {
        console.log("not deterministic enough");
      }
    } else {
      console.log("not found");
    }
  };
  const {
    submitTask,
    setSubmitData,
    submitData,
    submitResponse,
    isLoading: isSubmitting,
  } = useSubmitTask();

  return (
    <>
      <div className="flex gap-4 items-center">
        <p
          onClick={() => {
            getToken("people");
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
          <p onClick={() => getFullName(taskData.question)}>Get full name</p>
          {fullName && (
            <p onClick={() => fetchJson(taskData.data)}>Fetch data</p>
          )}
          {!isEmpty(jsonData) && (
            <p onClick={findMatchingPeople}>find matching people</p>
          )}
          {personDetails && (
            <p onClick={() => answerQuestion(personDetails)}>answer question</p>
          )}
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
