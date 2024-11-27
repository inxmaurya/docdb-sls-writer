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
exports.addMessage = void 0;
const mongoClient_1 = require("../lib/mongoClient");
const joi_1 = __importDefault(require("joi"));
// Define schema for input validation
const messageSchema = joi_1.default.object({
    message: joi_1.default.string().required().min(1).max(500), // Limit message length
});
const addMessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse and validate the incoming request body
        const body = JSON.parse(event.body || '{}');
        const validation = messageSchema.validate(body);
        if (validation.error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: validation.error.details[0].message }),
            };
        }
        // Get the database instance
        const db = yield (0, mongoClient_1.getDatabase)();
        // Insert the message into a collection (e.g., "messages")
        const result = yield db.collection('messages').insertOne({
            message: body.message,
            createdAt: new Date(),
        });
        // Respond with a success message and inserted document ID
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Message added successfully',
                data: { id: result.insertedId, message: body.message },
            }),
        };
    }
    catch (error) {
        console.error('Error adding message:', error);
        // Handle unexpected errors
        if (error instanceof SyntaxError) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid JSON payload' }),
            };
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to add message' }),
        };
    }
});
exports.addMessage = addMessage;
