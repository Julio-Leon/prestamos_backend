const { connectToDatabase } = require('./utils/db');
const Prestamo = require('./models/Prestamo');

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
    const id = segments[segments.length - 1]; // Get the last segment as id

    console.log('HTTP Method:', httpMethod);
    console.log('Path:', path);
    console.log('ID:', id);

    switch (httpMethod) {
      case 'GET':
        if (id && id !== 'prestamos') {
          // Get specific prestamo by id
          try {
            const prestamo = await Prestamo.findById(id);
            if (!prestamo) {
              return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: 'Préstamo no encontrado' }),
              };
            }
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(prestamo),
            };
          } catch (error) {
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({ message: 'Error al obtener préstamo', error: error.message }),
            };
          }
        } else {
          // Get all prestamos
          try {
            const prestamos = await Prestamo.find();
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify(prestamos),
            };
          } catch (error) {
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({ message: 'Error al obtener préstamos', error: error.message }),
            };
          }
        }

      case 'POST':
        try {
          const prestamoData = JSON.parse(body);
          
          const newPrestamoTemp = {
            cedula: prestamoData.cedula,
            paymentSchedule: prestamoData.paymentSchedule,
            prestamoAmount: Number(prestamoData.prestamoAmount),
            startDate: prestamoData.startDate,
            endDate: prestamoData.endDate,
            totalToPay: Number(prestamoData.totalToPay),
            interestEarn: Number(prestamoData.interestEarn),
            interestToPay: Number(prestamoData.interestToPay || prestamoData.interestEarn),
            capitalRemaining: Number(prestamoData.capitalRemaining || prestamoData.prestamoAmount),
            amountOfPayments: Number(prestamoData.amountOfPayments),
            amountPerPayment: Number(prestamoData.amountPerPayment),
            paymentsMade: Number(prestamoData.paymentsMade || 0),
            status: prestamoData.status || 'active'
          };

          const newPrestamo = await Prestamo.create(newPrestamoTemp);
          return {
            statusCode: 201,
            headers,
            body: JSON.stringify(newPrestamo),
          };
        } catch (error) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'Error al crear préstamo', error: error.message }),
          };
        }

      case 'PUT':
        if (!id || id === 'prestamos') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'ID requerido para actualizar' }),
          };
        }

        try {
          const prestamoData = JSON.parse(body);
          
          const updatedPrestamoData = {
            cedula: prestamoData.cedula,
            paymentSchedule: prestamoData.paymentSchedule,
            prestamoAmount: Number(prestamoData.prestamoAmount),
            startDate: prestamoData.startDate,
            endDate: prestamoData.endDate,
            totalToPay: Number(prestamoData.totalToPay),
            interestEarn: Number(prestamoData.interestEarn),
            interestToPay: Number(prestamoData.interestToPay || prestamoData.interestEarn),
            capitalRemaining: Number(prestamoData.capitalRemaining || prestamoData.prestamoAmount),
            amountOfPayments: Number(prestamoData.amountOfPayments),
            amountPerPayment: Number(prestamoData.amountPerPayment),
            paymentsMade: Number(prestamoData.paymentsMade || 0),
            status: prestamoData.status || 'active'
          };

          const updatedPrestamo = await Prestamo.findByIdAndUpdate(
            id,
            updatedPrestamoData,
            { new: true, runValidators: true }
          );

          if (!updatedPrestamo) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ message: 'Préstamo no encontrado' }),
            };
          }

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(updatedPrestamo),
          };
        } catch (error) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'Error al actualizar préstamo', error: error.message }),
          };
        }

      case 'DELETE':
        if (!id || id === 'prestamos') {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'ID requerido para eliminar' }),
          };
        }

        try {
          const deletedPrestamo = await Prestamo.findByIdAndDelete(id);

          if (!deletedPrestamo) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ message: 'Préstamo no encontrado' }),
            };
          }

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Préstamo eliminado exitosamente', prestamo: deletedPrestamo }),
          };
        } catch (error) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Error al eliminar préstamo', error: error.message }),
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
