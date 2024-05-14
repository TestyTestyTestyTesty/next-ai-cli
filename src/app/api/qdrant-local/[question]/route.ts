import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import { Document } from "langchain/document";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
const archive_path = "https://unknow.news/archiwum_aidevs.json";
const COLLECTION_NAME = "unknown_news";
interface collection {
  name: string;
}
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const question = req.url?.split("/").pop();
  if (!question) {
    return res.status(400).send("question is required");
  }
  const qdrant = new QdrantClient({
    url: process.env.QDRANT_CLOUD,
    //apiKey: process.env.QDRANT_CLOUD_API,
  });
  const embeddings = new OpenAIEmbeddings({
    maxConcurrency: 5,
    apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API,
  });
  const query = decodeURIComponent(question);
  const queryEmbedding = await embeddings.embedQuery(query);
  const result = await qdrant.getCollections();

  const indexed = result.collections.find(
    (collection: collection) => collection.name === COLLECTION_NAME
  );

  // Create collection if not exists
  if (!indexed) {
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: { size: 1536, distance: "Cosine", on_disk: true },
    });
  }

  const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);
  console.log(collectionInfo);

  // Index documents if not indexed
  if (!collectionInfo.points_count) {
    console.log("populating collection...");
    // Read File
    const response = await fetch(archive_path);
    const responseJson = await response.json();
    let documents: Document<Record<string, any>>[] = [];
    responseJson.forEach((obj) => {
      const metadata = {
        source: COLLECTION_NAME,
        uuid: uuidv4(),
        info: obj.info,
        link: obj.url,
      };
      documents.push(
        new Document({ pageContent: obj.title, metadata: metadata })
      );
    });

    const points = [];
    for (const document of documents) {
      const [embedding] = await embeddings.embedDocuments([
        document.pageContent,
      ]);
      points.push({
        id: document.metadata.uuid,
        payload: document.metadata,
        vector: embedding,
      });
    }

    const res = await qdrant.upsert(COLLECTION_NAME, {
      wait: true,
      batch: {
        ids: points.map((point) => point.id),
        vectors: points.map((point) => point.vector),
        payloads: points.map((point) => point.payload),
      },
    });
    console.log(res);
  }
  const search = await qdrant.search(COLLECTION_NAME, {
    vector: queryEmbedding,
    limit: 1,
    filter: {
      must: [
        {
          key: "source",
          match: {
            value: COLLECTION_NAME,
          },
        },
      ],
    },
  });
  return NextResponse.json(search);
}
