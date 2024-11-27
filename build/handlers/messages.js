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
exports.messages = void 0;
const mongoClient_1 = require("../lib/mongoClient");
const messages = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the database instance
        const db = yield (0, mongoClient_1.getDatabase)();
        // Get messages from the collection (e.g., "messages")
        const result = yield db.collection('messages').find({}).toArray();
        // Respond with a success message and inserted document ID
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Message added successfully',
                data: { status: 'success', message: result },
            }),
        };
    }
    catch (error) {
        console.error('Error to fetch messages:', error);
        // Handle unexpected errors
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch messages' }),
        };
    }
});
exports.messages = messages;
