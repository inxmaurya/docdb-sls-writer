"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeMongoClient = exports.getDatabase = exports.getMongoClient = void 0;
const mongodb_1 = require("mongodb");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const firstPartMongoDBUri = process.env.MONGO_URI;
const mongoUri = `${firstPartMongoDBUri}?tls=true&tlsCAFile=global-bundle.pem&authSource=admin&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;
const dbName = process.env.DATABASE_NAME;
const isSSLTLS = process.env.NODE_ENV === "production" || process.env.IS_TLS === "true";
const caFilePath = path_1.default.resolve(__dirname, '../certs/global-bundle.pem');
// Validate environment variables and certificate path
if (!mongoUri) {
    throw new Error("Environment variable MONGO_URI is required");
}
if (!dbName) {
    throw new Error("Environment variable DATABASE_NAME is required");
}
if (!fs_1.default.existsSync(caFilePath)) {
    throw new Error(`Certificate file not found at ${caFilePath}`);
}
let client = null;
const getMongoClient = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!client) {
        try {
            client = new mongodb_1.MongoClient(mongoUri, {
                tls: isSSLTLS,
                tlsCAFile: caFilePath,
                retryWrites: false, // Disable retryable writes
                connectTimeoutMS: 10000,
                authSource: "admin",
            });
            yield client.connect();
            console.log("successfully connected to MongoDB: " + mongoUri);
        }
        catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            throw new Error("MongoDB connection error");
        }
    }
    return client;
});
exports.getMongoClient = getMongoClient;
const getDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const mongoClient = yield (0, exports.getMongoClient)();
    return mongoClient.db(dbName);
});
exports.getDatabase = getDatabase;
const closeMongoClient = () => __awaiter(void 0, void 0, void 0, function* () {
    if (client) {
        yield client.close();
        client = null;
        console.log("MongoDB client closed");
    }
});
exports.closeMongoClient = closeMongoClient;
