import { APIGatewayProxyHandler } from 'aws-lambda';
import { getDatabase } from '../lib/mongoClient';
import { ObjectId } from 'mongodb';

export const message: APIGatewayProxyHandler = async (event) => {
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
    if (!ObjectId.isValid(messageId)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid 'id' parameter format" }),
      };
    }

    const objectId = new ObjectId(messageId);

    // Get the database instance
    const db = await getDatabase();

    // Find the message with the specified _id
    const result = await db.collection('messages').findOne({ _id: objectId });

    if (!result) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Message not found" }),
      };
    }

    // Respond with the found message
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Message found successfully",
        data: result,
      }),
    };
  } catch (error) {
    console.error("Error finding message:", error);

    // Handle unexpected errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to find message" }),
    };
  }
};
