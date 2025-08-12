const express = require('express')
const PORT = process.env.PORT || 4000
const cors = require('cors')
require('dotenv').config();
const clientController = require('./Controllers/clientRoutes.js')
const prestamosController = require('./Controllers/prestamosRoutes.js')

const app = express()
app.use(express.json())

app.use(cors())
app.use('/clients', clientController)
app.use('/prestamos', prestamosController)

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error)
    
    if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ 
            message: 'Ya existe un cliente con esta cédula',
            error: 'Duplicate key error'
        })
    }
    
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message)
        return res.status(400).json({ 
            message: messages.join(', '),
            error: 'Validation error'
        })
    }
    
    res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
    })
})

app.listen(4000, () => {
    console.log(`Server listening on port: ${PORT}`)
})