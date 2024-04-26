"use client";
import { fetchTaskData, requestMethod } from "@/app/helpers/fetchTaskData";
import { useCompletionApi } from "@/app/hooks/useCompletionApi";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import { isNull } from "lodash";

const next_hint = "następna wskazówka";

export default function Whoami() {
  const { getResponseFromCompletionApi } = useCompletionApi();
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

  const startGuessingGame = async () => {
    const hints = [taskData.hint];
    while (isNull(submitData)) {
      const body = {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Bawimy się w zgadywanie osoby. 
            Kontekst zawiera wskazówki dotyczące osoby którą probujesz odgadnąć. 
            Twoim celem jest zgadnąć, kto jest tą osobą.
            Dopóki nie będziesz całkowicie pewien, czy wiesz, kim jest ta osoba odpowiadasz "${next_hint}".
            Gdy jestes calkowicie pewien, wypisz imie i nazwisko.
            Jeśli masz jakiekolwiek wątpliwości odpowiadasz "${next_hint}".
            ---
            przykład pierwszej wskazówki:
            "ta osoba posiada długie włosy"
            Oczekiwana odpowiedź gdy wskazówka nie jest wystarczająca aby zgadnąć:
            "${next_hint}"
            ---
            
            ##
            kontekst: ${hints.map((hint) => `"${hint}, "`)}
            ##
            `,
          },
          {
            role: "user",
            content: "zgadnij o kim mowa",
          },
        ],
      };
      const res = await getResponseFromCompletionApi(body);
      if (res.choices[0].message.content === next_hint) {
        try {
          const fetchedData = await fetchTaskData({
            token,
            method: requestMethod.GET,
          });
          if (fetchedData) {
            hints.push(fetchedData.hint);
          }
        } catch (err) {
          console.log(err);
          break;
        }
      } else {
        setSubmitData({ answer: res.choices[0].message.content });
        break;
      }
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center">
        <p
          onClick={() => {
            getToken("whoami");
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
        <div className="flex gap-4 items-center">
          <p onClick={() => startGuessingGame()}>Start guessing game</p>
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
