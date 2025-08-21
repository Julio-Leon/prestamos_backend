/**
 * CORS middleware for Netlify Functions
 * Handles CORS headers for all requests including OPTIONS preflight requests
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow all origins
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
};

// Handle CORS preflight requests
const handleCors = (event) => {
  // Handle OPTIONS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No content
      headers: corsHeaders,
      body: ''
    };
  }
  
  // Return headers for other request types
  return corsHeaders;
};

module.exports = { corsHeaders, handleCors };
