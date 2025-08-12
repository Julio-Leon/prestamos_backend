const { connectToDatabase } = require('./utils/db');
const Client = require('./models/Client');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

  try {
    await connectToDatabase();

    const { httpMethod, path, pathParameters, body } = event;
    const segments = path.split('/').filter(segment => segment !== '');
    const cedula = segments[segments.length - 1]; // Get the last segment as cedula

    console.log('HTTP Method:', httpMethod);
    console.log('Path:', path);
    console.log('Cedula:', cedula);

    switch (httpMethod) {
      case 'GET':
        if (cedula && cedula !== 'clients') {
          // Get specific client by cedula
          try {
            const client = await Client.findOne({ cedula: cedula });
            if (!client) {
              return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Cliente no encontrado' }),
              };
            }
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(client),
            };
          } catch (error) {
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({ message: 'Error al obtener cliente', error: error.message }),
            };
          }
        } else {
          // Get all clients
          try {
            const clients = await Client.find();
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(clients),
            };
          } catch (error) {
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({ message: 'Error al obtener clientes', error: error.message }),
            };
          }
        }

      case 'POST':
        try {
          const clientData = JSON.parse(body);
          
          const clientObject = {
            cedula: clientData.cedula,
            firstName: clientData.firstName,
            lastName: clientData.lastName,
            department: clientData.department,
            telephoneNumber: clientData.telephoneNumber && clientData.telephoneNumber.length > 0 ? parseInt(clientData.telephoneNumber) : undefined,
            celularNumber: parseInt(clientData.celularNumber),
            address: {
              number: clientData.number ? parseInt(clientData.number) : undefined,
              street: clientData.street,
              apartment: clientData.apartment,
              county: clientData.county,
              state: clientData.state,
              zipCode: clientData.zipCode ? parseInt(clientData.zipCode) : undefined
            },
            recommendedBy: clientData.recommendedBy || clientData.recommendation
          };

          const newClient = await Client.create(clientObject);
          return {
            statusCode: 201,
            headers,
            body: JSON.stringify(newClient),
          };
        } catch (error) {
          if (error.code === 11000) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ message: 'Ya existe un cliente con esta cédula' }),
            };
          }
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'Error al crear cliente', error: error.message }),
          };
        }

      case 'PUT':
        if (!cedula || cedula === 'clients') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'Cédula requerida para actualizar' }),
          };
        }

        try {
          const clientData = JSON.parse(body);
          
          const clientObject = {
            cedula: clientData.cedula,
            firstName: clientData.firstName,
            lastName: clientData.lastName,
            department: clientData.department,
            telephoneNumber: clientData.telephoneNumber && clientData.telephoneNumber.length > 0 ? parseInt(clientData.telephoneNumber) : undefined,
            celularNumber: parseInt(clientData.celularNumber),
            address: {
              number: clientData.number ? parseInt(clientData.number) : undefined,
              street: clientData.street,
              apartment: clientData.apartment,
              county: clientData.county,
              state: clientData.state,
              zipCode: clientData.zipCode ? parseInt(clientData.zipCode) : undefined
            },
            recommendedBy: clientData.recommendedBy || clientData.recommendation
          };

          const updatedClient = await Client.findOneAndUpdate(
            { cedula: cedula },
            clientObject,
            { new: true, runValidators: true }
          );

          if (!updatedClient) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ message: 'Cliente no encontrado' }),
            };
          }

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(updatedClient),
          };
        } catch (error) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'Error al actualizar cliente', error: error.message }),
          };
        }

      case 'DELETE':
        if (!cedula || cedula === 'clients') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'Cédula requerida para eliminar' }),
          };
        }

        try {
          const deletedClient = await Client.findOneAndDelete({ cedula: cedula });

          if (!deletedClient) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ message: 'Cliente no encontrado' }),
            };
          }

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Cliente eliminado exitosamente', client: deletedClient }),
          };
        } catch (error) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Error al eliminar cliente', error: error.message }),
          };
        }

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ message: `Método ${httpMethod} no permitido` }),
        };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error interno del servidor', error: error.message }),
    };
  }
};
