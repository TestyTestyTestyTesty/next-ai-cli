import axios from "axios";
import { isNil } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const url = req.url?.split("/").pop();
  if (!url) {
    return res.status(400).send("Url is required");
  }
  const decodedUrl = decodeURIComponent(url);
  try {
    const response = await axios.get(decodedUrl);

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
