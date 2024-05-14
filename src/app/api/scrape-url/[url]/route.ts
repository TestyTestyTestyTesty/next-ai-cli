import type { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-extra";

async function getTextFromUrl(url: string, maxRetries = 5, retryDelay = 2000) {
  let retryCount = 0;
  let text = null;

  while (retryCount < maxRetries) {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Set timeout for page load
      await page.setDefaultNavigationTimeout(30000);

      const customUA =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";

      // Set custom user agent
      await page.setUserAgent(customUA);

      // Navigate to the URL
      const web = await page.goto(url, { waitUntil: "domcontentloaded" });

      console.log(web?.status());
      if (web?.status && web?.status() !== 200)
        throw new Error("error while fetching content");
      // Wait for the <pre> tag to appear
      await page.waitForSelector("pre");

      // Get text content of <pre> tag
      text = await page.$eval("pre", (pre) => pre.textContent);

      await browser.close();

      return text;
    } catch (error) {
      console.error(`Error fetching text: ${error}`);
      retryCount++;
      console.log(`Retrying... (${retryCount}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return new Error("Max retries exceeded. Unable to fetch text.");
}

export async function GET(req: NextRequest, res: NextApiResponse) {
  const url = req.url?.split("/").pop();
  if (!url) {
    return res.status(400).send("Task name is required");
  }
  const decodedUrl = decodeURIComponent(url);
  const text = await getTextFromUrl(decodedUrl);
  if (text instanceof Error) {
    return NextResponse.json({
      error: "Error while fetching text, try again later",
    });
  } else {
    return NextResponse.json(text);
  }
}
