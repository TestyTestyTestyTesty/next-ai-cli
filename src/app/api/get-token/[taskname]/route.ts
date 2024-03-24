import axios from "axios";
import { isNil } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const taskName = req.url?.split("/").pop();
  if (!taskName) {
    return res.status(400).send("Task name is required");
  }
  try {
    const requestBody = {
      apikey: process.env.AI_DEVS_API,
    };
    const response = await axios.post(
      `https://tasks.aidevs.pl/token/${taskName}`,
      requestBody
    );

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!isNil(error.response?.data)) {
        return NextResponse.json(error.response.data);
      } else {
        return NextResponse.json(error.message);
      }
    } else {
      console.error(error);
    }
  }
}
