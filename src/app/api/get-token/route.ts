import type { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: Request) {
  const data = await req.json();
}
