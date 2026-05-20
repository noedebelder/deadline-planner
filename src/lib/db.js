import { MongoClient } from "mongodb";
import { MONGODB_URI } from "$env/static/private";

export async function getDb() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client.db("deadline-planner");
}
