import { APIGatewayProxyHandler } from 'aws-lambda';
import { getDatabase } from '../lib/mongoClient';
import { ObjectId } from 'mongodb';

export const updateMessage: APIGatewayProxyHandler = async (event) => {
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
    if (!ObjectId.isValid(messageId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid 'id' parameter format" }),
      };
    }

    const objectId = new ObjectId(messageId);

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
    const db = await getDatabase();

    // Find and update the message
    const result = await db.collection('messages').findOneAndUpdate(
      { _id: objectId }, // Filter: Find the document by _id
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
  } catch (error) {
    console.error("Error updating message:", error);

    // Handle unexpected errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update message" }),
    };
  }
};
