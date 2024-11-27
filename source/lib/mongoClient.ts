import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI!;
const dbName = process.env.DATABASE_NAME!;
const isSSLTLS = process.env.NODE_ENV! === "production" ? true : false;

console.log("mongoUri: " + mongoUri);
console.log("dbName: " + dbName);
if (!mongoUri) {
  throw new Error("Environment variable MONGO_URI is required");
}

if (!dbName) {
  throw new Error("Environment variable DATABASE_NAME is required");
}

let client: MongoClient | null = null;

export const getMongoClient = async (): Promise<MongoClient> => {
  if (!client) {
    try {
      client = new MongoClient(mongoUri, {
        ssl: isSSLTLS,
        retryWrites: true,
        connectTimeoutMS: 10000,
        authSource: "admin",
      });
      await client.connect();
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw new Error("MongoDB connection error");
    }
  }
  return client;
};

export const getDatabase = async () => {
  const mongoClient = await getMongoClient();
  return mongoClient.db(dbName);
};

export const closeMongoClient = async () => {
  if (client) {
    await client.close();
    client = null;
    console.log("MongoDB client closed");
  }
};
