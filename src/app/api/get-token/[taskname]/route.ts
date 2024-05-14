import axios from "axios";
import { isNil } from "lodash";
import type { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponse) {
  const token = req.url?.split("/").pop();
  if (!token) {
    return res.status(400).send("Task name is required");
  }

  try {
    const requestBody = {
      apikey: process.env.AI_DEVS_API,
    };
    const response = await axios.post(
      `https://tasks.aidevs.pl/token/${token}`,
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
