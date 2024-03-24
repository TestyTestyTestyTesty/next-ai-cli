import type { NextApiRequest, NextApiResponse } from "next";

export function GET(req: NextApiRequest, res: NextApiResponse) {
  // Check if the `id` parameter exists in the query
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    // Handle the case where `id` is not provided or is in an unexpected format
    return res.status(400).json({ error: "Invalid or missing id parameter" });
  }

  // Log the `id` to the server console
  console.log("URL Param:", id);

  // Respond to the request
  res.status(200).json({ message: `User ID is: ${id}` });
}
