import { APIGatewayProxyHandler } from 'aws-lambda';
import { getDatabase } from '../lib/mongoClient';

export const messages: APIGatewayProxyHandler = async (event) => {
  try {
    // Get the database instance
    const db = await getDatabase();

    // Get messages from the collection (e.g., "messages")
    const result = await db.collection('messages').find({}).toArray();

    // Respond with a success message and inserted document ID
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Message added successfully',
        data: { status: 'success', message: result },
      }),
    };
  } catch (error) {
    console.error('Error to fetch messages:', error);

    // Handle unexpected errors
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch messages' }),
    };
  }
};
