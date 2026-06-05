import { getDb } from "./db.js";
import { ObjectId } from "mongodb";

export async function getUserFromCookie(cookies) {
  const userId = cookies.get("userId");
  if (!userId) return null;
  try {
    const db = await getDb();
    return await db.collection("users").findOne({ _id: new ObjectId(userId) });
  } catch {
    return null;
  }
}
