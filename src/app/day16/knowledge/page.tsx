"use client";
import { useCompletionApi } from "@/app/hooks/useCompletionApi";
import { useGetTaskData } from "@/app/hooks/useGetTaskData";
import { useGetToken } from "@/app/hooks/useGetToken";
import { useSubmitTask } from "@/app/hooks/useSubmitTask";
import { Spinner } from "@/app/modules/Spinner";
import axios from "axios";
import { isNull } from "lodash";

enum TYPE_OF_DATA {
  EXCHANGE = "fetchExchangeRate",
  POPULATION = "fetchPopulation",
  CAPITAL = "fetchCapital",
  GENERAL = "general",
}
export default function People() {
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

  const getPopulation = async (country: string) => {
    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${country}`
      );
      if (response) {
        setSubmitData({ answer: response.data[0].population });
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

  const getExchangeRate = async (currency: string) => {
    try {
      const response = await axios.get(
        `https://api.nbp.pl/api/exchangerates/rates/A/${currency}?format=json`
      );
      if (response) {
        console.log(response.data.rates[0].mid);
        setSubmitData({ answer: response.data.rates[0].mid });
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

  const functionCallingGPT = async (question: any) => {
    const body = {
      model: "gpt-4",
      tools: [
        {
          type: "function",
          function: {
            name: TYPE_OF_DATA.EXCHANGE,
            description: `Calls to National Bank of Poland's API get the exchange rate for a specified currency. Returns the mid market rate as a number.`,
            parameters: {
              type: "object",
              properties: {
                currency: {
                  type: "string",
                  description:
                    "Currency code (e.g., USD, EUR) for which the exchange rate is required.",
                },
              },
              required: ["currency"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: TYPE_OF_DATA.POPULATION,
            description:
              "Calls an API - restcountries.com -to get the population of a specified country. Returns the population as a number.",
            parameters: {
              type: "object",
              properties: {
                country: {
                  type: "string",
                  description:
                    'Country name in ALWAYS inEnglish for which population data is required (e.g., "Poland", "Germany")',
                },
              },
              required: ["country"],
            },
          },
        },
      ],
      messages: [
        {
          role: "system",
          content: `You are a sophisticated assistant designed to precisely interpret questions and select the most appropriate function to fetch information based on the query category. Use predefined functions for specific requests and provide answers in JSON format. Identify key phrases that indicate the type of query and select the function accordingly. If the question's intent is unclear, base your response on the most probable interpretation of the query.

          Guide###:
          - Format numbers as integers without additional formatting or units.
          - For exchange rates, identify questions involving 'exchange rate', 'currency', or specific currency codes (e.g., USD, EUR). Use the 'fetchExchangeRate' function.
          - For population statistics, detect phrases like 'population of', 'how many people in', and specific country names. Use the 'fetchPopulation' function.
          - For general knowledge questions that do not fit the above categories, provide a direct answer if possible. Use general reasoning to answer if the query does not specify a function.
          - Ensure you follow ALL the provided instructions when creating your output.
          - Adhere strictly to the outlined steps and requirements.
          - Format your output as specified, using the provided examples as a guide.
          
          Examples:
          Q: What is the exchange rate for the Euro?
          A: {
            "function": "fetchExchangeRate",
            "arguments": {"currency": "EUR"}
          }
          
          Q: What is the population of Germany?
          A: {
            "function": "fetchPopulation",
            "arguments": {"country": "germany"}
          }
          
          Q: Approximately how many people live in Poland?
          A: {
            "function": "fetchPopulation",
            "arguments": {"country": "poland"}
          }
          
          Q: Who painted the Mona Lisa?
          A: {
            "type": "general",
            "arguments": {"answer": "Leonardo da Vinci"}
          }`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    };
    const res = await getResponseFromCompletionApi(body);
    if (res.choices[0].message) {
      const response = JSON.parse(res.choices[0].message.content);
      const functionType = response.function;
      console.log(response, functionType);
      if (functionType === TYPE_OF_DATA.EXCHANGE) {
        getExchangeRate(response.arguments.currency);
      } else if (functionType === TYPE_OF_DATA.POPULATION) {
        getPopulation(response.arguments.country);
      } else {
        setSubmitData({ answer: response.arguments.answer });
      }
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center">
        <p
          onClick={() => {
            getToken("knowledge");
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
          <p onClick={() => functionCallingGPT(taskData.question)}>
            function calling
          </p>
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
