import { MongoClient } from "mongodb";
import { MONGODB_URI } from "$env/static/private";

let cachedClient = null;
let cachedDb = null;

export async function getDb() {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  cachedDb = client.db("deadline-planner");

  // Indexes einmalig erstellen (idempotent in MongoDB)
  await Promise.all([
    cachedDb.collection("deadlines").createIndex({ userId: 1, deadline: 1 }),
    cachedDb.collection("deadlines").createIndex({ userId: 1, status: 1 }),
    cachedDb.collection("deadlines").createIndex({ deadline: 1, status: 1 }),
    cachedDb.collection("users").createIndex({ username: 1 }, { unique: true }),
  ]);

  return cachedDb;
}
