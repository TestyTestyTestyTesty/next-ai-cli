import axios from "axios";
import { isNil } from "lodash";
import type { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import qs from "qs";

export async function GET(req: NextRequest, res: NextApiResponse) {
  const token = req.url?.split("/").pop();
  if (!token) {
    return res.status(400).send("Token is required");
  }
  try {
    const response = await axios.get(`https://tasks.aidevs.pl/task/${token}`);

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

export async function POST(req: Request, res: NextApiResponse) {
  const body = await req.json();
  const token = req.url?.split("/").pop();
  if (!token) {
    return res.status(400).send("Token is required");
  }
  const queryString = qs.stringify(body);

  try {
    const response = await axios.post(
      `https://tasks.aidevs.pl/task/${token}`,
      queryString
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
