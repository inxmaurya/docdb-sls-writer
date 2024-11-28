import { MongoClient } from "mongodb";
import fs from 'fs';
import path from 'path';

const firstPartMongoDBUri = process.env.MONGO_URI!;

const mongoUri = `${firstPartMongoDBUri}?tls=true&tlsCAFile=global-bundle.pem&authSource=admin&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;
const dbName = process.env.DATABASE_NAME!;
const isSSLTLS = process.env.NODE_ENV === "production" || process.env.IS_TLS === "true";
const caFilePath = path.resolve(__dirname, '../certs/global-bundle.pem');

// Validate environment variables and certificate path
if (!mongoUri) {
  throw new Error("Environment variable MONGO_URI is required");
}

if (!dbName) {
  throw new Error("Environment variable DATABASE_NAME is required");
}

if (!fs.existsSync(caFilePath)) {
  throw new Error(`Certificate file not found at ${caFilePath}`);
}

let client: MongoClient | null = null;

export const getMongoClient = async (): Promise<MongoClient> => {
  if (!client) {
    try {
      client = new MongoClient(mongoUri, {
        tls: isSSLTLS,
        tlsCAFile: caFilePath,
        retryWrites: false, // Disable retryable writes
        connectTimeoutMS: 10000,
        authSource: "admin",
      });
      await client.connect();
      console.log("successfully connected to MongoDB: " + mongoUri);
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
