"use server";

import { Db, MongoClient } from "mongodb";
import { assertEnvVars, parsedEnv } from "@/lib/parsedEnv";
import { lokiService } from "@/lib/loggingService";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  assertEnvVars(["MONGODB_URI"], "connectToDatabase");

  const client = new MongoClient(parsedEnv.MONGODB_URI);
  const connectStart = Date.now();
  await client.connect();
  const connectEnd = Date.now();
  lokiService.sendLog("connectToDatabase", {
    duration: connectEnd - connectStart,
  });

  const db = client.db("metal_db");
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
