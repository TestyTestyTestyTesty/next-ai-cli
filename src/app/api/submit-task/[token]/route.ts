import axios from "axios";
import { isNil } from "lodash";
import type { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const data = await req.json();
  const token = req.url?.split("/").pop();
  if (!token || !data) {
    return res.status(400).send("Required data was not send");
  }
  try {
    const response = await axios.post(
      `https://tasks.aidevs.pl/answer/${token}`,
      data
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
