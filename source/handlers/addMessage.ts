import { APIGatewayProxyHandler } from 'aws-lambda';
import { getDatabase } from '../lib/mongoClient';
import Joi from 'joi';

// Define schema for input validation
const messageSchema = Joi.object({
  message: Joi.string().required().min(1).max(500), // Limit message length
});

export const addMessage: APIGatewayProxyHandler = async (event) => {
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
    const db = await getDatabase();

    // Insert the message into a collection (e.g., "messages")
    const result = await db.collection('messages').insertOne({
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
  } catch (error) {
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
};
