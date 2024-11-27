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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = void 0;
const mongoClient_1 = require("../lib/mongoClient");
const mongodb_1 = require("mongodb"); // Import ObjectId for MongoDB
const deleteMessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Access query string parameters
        const params = event.queryStringParameters || {};
        console.log("Query string parameters:", params);
        // Retrieve the `id` parameter
        const messageId = params["id"];
        console.log("Value of id:", messageId);
        if (!messageId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required query parameter 'id'" }),
            };
        }
        // Validate and convert the id to ObjectId
        if (!mongodb_1.ObjectId.isValid(messageId)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid 'id' parameter format" }),
            };
        }
        const objectId = new mongodb_1.ObjectId(messageId);
        // Get the database instance
        const db = yield (0, mongoClient_1.getDatabase)();
        // Delete the message with the specified _id
        const result = yield db.collection('messages').deleteOne({ _id: objectId });
        if (result.deletedCount === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Message not found" }),
            };
        }
        // Respond with a success message
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Message deleted successfully",
                data: { id: messageId },
            }),
        };
    }
    catch (error) {
        console.error("Error deleting message:", error);
        // Handle unexpected errors
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to delete message" }),
        };
    }
});
exports.deleteMessage = deleteMessage;
