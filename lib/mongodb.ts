import { MongoClient, type Db } from "mongodb";

// Serverless-safe MongoDB connection. On Vercel every function invocation can
// reuse a warm client, so we cache the connect promise on globalThis. Without
// this, cold starts (and dev hot-reloads) open a new pool each time and quickly
// exhaust the Atlas connection limit.

const dbName = process.env.MONGODB_DB || "tetfund";

type Cached = { client: MongoClient; promise: Promise<MongoClient> };

const globalForMongo = globalThis as unknown as {
  _mongo?: Cached;
};

// Checked lazily (not at import) so `next build` doesn't fail when the URI is
// only present at runtime.
function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (local) and to your Vercel project's Environment Variables (deploy).",
    );
  }
  if (!globalForMongo._mongo) {
    const client = new MongoClient(uri);
    globalForMongo._mongo = { client, promise: client.connect() };
  }
  return globalForMongo._mongo.promise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}
