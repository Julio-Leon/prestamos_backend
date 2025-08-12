const { handler: clientsHandler } = require('./netlify/functions/clients');
const { handler: prestamosHandler } = require('./netlify/functions/prestamos');

// Test GET clients
async function testClients() {
  console.log('Testing Clients Function...');
  
  const event = {
    httpMethod: 'GET',
    path: '/clients',
    pathParameters: null,
    body: null
  };
  
  const context = {};
  
  try {
    const result = await clientsHandler(event, context);
    console.log('✅ Clients GET test:', result.statusCode === 200 ? 'PASSED' : 'FAILED');
    console.log('Status:', result.statusCode);
  } catch (error) {
    console.log('❌ Clients test failed:', error.message);
  }
}

// Test GET prestamos
async function testPrestamos() {
  console.log('\nTesting Prestamos Function...');
  
  const event = {
    httpMethod: 'GET',
    path: '/prestamos',
    pathParameters: null,
    body: null
  };
  
  const context = {};
  
  try {
    const result = await prestamosHandler(event, context);
    console.log('✅ Prestamos GET test:', result.statusCode === 200 ? 'PASSED' : 'FAILED');
    console.log('Status:', result.statusCode);
  } catch (error) {
    console.log('❌ Prestamos test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🧪 Running Serverless Function Tests...\n');
  console.log('Note: Database connection required for full functionality\n');
  
  await testClients();
  await testPrestamos();
  
  console.log('\n✨ Tests completed!');
  console.log('💡 To run with database connection, set MONGO_STRING in .env file');
}

runTests();
