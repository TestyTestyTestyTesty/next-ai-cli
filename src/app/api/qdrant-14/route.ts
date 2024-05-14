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
  const embeddings = new OpenAIEmbeddings({
    maxConcurrency: 5,
    apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API,
  });
  const query =
    "Co różni pseudonimizację od anonimizowania danych?, zwróć link";
  const queryEmbedding = await embeddings.embedQuery(query);
  const collections = await fetch(
    "https://bc4f82c5-b600-4394-b68d-f9e1f767714b.us-east4-0.gcp.cloud.qdrant.io:6333/collections",
    {
      headers: {
        "api-key": "dgHnPzMuWNMr7aSA0YAm5S3u3ilCvGcea52MNXk91sueLagiRobw0g",
        //"Cache-Control": "no-cache",
      },
    }
  );
  const { result } = await collections.json();

  const indexed = result.collections.find(
    (collection: collection) => collection.name === COLLECTION_NAME
  );

  // Create collection if not exists
  if (!indexed) {
    console.log("not indexed, indexing...");
    await fetch(
      `https://bc4f82c5-b600-4394-b68d-f9e1f767714b.us-east4-0.gcp.cloud.qdrant.io:6333/collections/${COLLECTION_NAME}`,
      {
        method: "PUT",
        headers: {
          "api-key": "dgHnPzMuWNMr7aSA0YAm5S3u3ilCvGcea52MNXk91sueLagiRobw0g",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          vectors: { size: 1536, distance: "Cosine", on_disk: true },
        }),
      }
    );
  }

  const collection = await fetch(
    `https://bc4f82c5-b600-4394-b68d-f9e1f767714b.us-east4-0.gcp.cloud.qdrant.io:6333/collections/${COLLECTION_NAME}`,
    {
      headers: {
        "api-key": "dgHnPzMuWNMr7aSA0YAm5S3u3ilCvGcea52MNXk91sueLagiRobw0g",
        "Cache-Control": "no-cache",
      },
    }
  );
  const { result: collectionInfo } = await collection.json();

  /* // Index documents if not indexed
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

    const upsert = await fetch(
      `https://bc4f82c5-b600-4394-b68d-f9e1f767714b.us-east4-0.gcp.cloud.qdrant.io:6333/collections/${COLLECTION_NAME}/points`,
      {
        method: "PUT",
        headers: {
          "api-key": "dgHnPzMuWNMr7aSA0YAm5S3u3ilCvGcea52MNXk91sueLagiRobw0g",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          wait: true,
          batch: {
            ids: points.map((point) => point.id),
            vectors: points.map((point) => point.vector),
            payloads: points.map((point) => point.payload),
          },
        }),
      }
    );

    await upsert.json();
  } */
  console.log("search start");
  const search = await fetch(
    `https://bc4f82c5-b600-4394-b68d-f9e1f767714b.us-east4-0.gcp.cloud.qdrant.io:6333/collections/${COLLECTION_NAME}/points/search`,
    {
      method: "POST",
      headers: {
        "api-key": "dgHnPzMuWNMr7aSA0YAm5S3u3ilCvGcea52MNXk91sueLagiRobw0g",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
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
      }),
    }
  );
  const searchJson = await search.json();
  return NextResponse.json(searchJson);
}
