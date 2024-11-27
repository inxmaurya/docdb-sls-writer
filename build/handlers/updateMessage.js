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
exports.updateMessage = void 0;
const mongoClient_1 = require("../lib/mongoClient");
const mongodb_1 = require("mongodb");
const updateMessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse query string parameters
        const params = event.queryStringParameters || {};
        const messageId = params["id"];
        console.log("Query string parameters:", params);
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
        // Parse the request body for updates
        const body = JSON.parse(event.body || '{}');
        const { message } = body;
        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "The 'message' field is required in the request body" }),
            };
        }
        // Get the database instance
        const db = yield (0, mongoClient_1.getDatabase)();
        // Find and update the message
        const result = yield db.collection('messages').findOneAndUpdate({ _id: objectId }, // Filter: Find the document by _id
        { $set: { message: message, updatedAt: new Date() } }, // Update: Set new message and updatedAt timestamp
        { returnDocument: 'after' } // Options: Return the updated document
        );
        console.log("result");
        console.log(result);
        console.log("result");
        if (!result) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Message not found" }),
            };
        }
        // Respond with the updated document
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Message updated successfully",
                data: result.value,
            }),
        };
    }
    catch (error) {
        console.error("Error updating message:", error);
        // Handle unexpected errors
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to update message" }),
        };
    }
});
exports.updateMessage = updateMessage;
