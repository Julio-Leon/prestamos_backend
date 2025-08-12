const { connectToDatabase } = require('./utils/db');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event, context) => {
  // Handle preflight CORS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    // Test database connection
    await connectToDatabase();
    
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'prestamos-api',
      version: '1.0.0',
      database: 'connected',
      environment: process.env.NODE_ENV || 'production'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(healthCheck),
    };
  } catch (error) {
    console.error('Health check failed:', error);
    
    const healthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'prestamos-api',
      version: '1.0.0',
      database: 'disconnected',
      error: error.message,
      environment: process.env.NODE_ENV || 'production'
    };

    return {
      statusCode: 503,
      headers,
      body: JSON.stringify(healthCheck),
    };
  }
};
