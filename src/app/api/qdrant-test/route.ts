import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { Document } from "langchain/document";
import { v4 as uuidv4 } from "uuid";
import { QdrantClient } from "@qdrant/js-client-rest";
import { OpenAIEmbeddings } from "@langchain/openai";
const MEMORY_PATH = process.cwd() + "/src/app/api/qdrant-test/memory.md";
const COLLECTION_NAME = "ai_devs";
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const qdrant = new QdrantClient({
    url: process.env.QDRANT_CLOUD,
    //apiKey: process.env.QDRANT_CLOUD_API,
  });
  const embeddings = new OpenAIEmbeddings({
    maxConcurrency: 5,
    apiKey: process.env.NEXT_PUBLIC_OPEN_AI_API,
  });
  const query = "what programming language adam hates";
  const queryEmbedding = await embeddings.embedQuery(query);
  const result = await qdrant.getCollections();
  const indexed = result.collections.find(
    (collection) => collection.name === COLLECTION_NAME
  );
  console.log(result);
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
    // Read File
    const loader = new TextLoader(MEMORY_PATH);
    let [memory] = await loader.load();
    let documents = memory.pageContent
      .split("\n\n")
      .map((content) => new Document({ pageContent: content }));

    // Add metadata
    documents = documents.map((document) => {
      document.metadata.source = COLLECTION_NAME;
      document.metadata.content = document.pageContent;
      document.metadata.uuid = uuidv4();
      return document;
    });

    // Generate embeddings
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

    // Index
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
