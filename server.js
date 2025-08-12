const express = require('express')
const PORT = process.env.PORT || 4000
const cors = require('cors')
require('dotenv').config();
const clientController = require('./Controllers/clientRoutes.js')
const prestamosController = require('./Controllers/prestamosRoutes.js')

const app = express()
app.use(express.json())

// Enhanced CORS configuration for both local development and production
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://127.0.0.1:3000', 
        'https://prestamosleon.netlify.app',
        // Add your Render frontend URL here when you deploy
        /https:\/\/.*\.onrender\.com$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Additional headers for better compatibility
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Root endpoint for deployment health checks
app.get('/', (req, res) => {
    res.json({ 
        message: 'Prestamos Backend API',
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString() 
    })
})

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    })
})

app.use('/clients', clientController)
app.use('/prestamos', prestamosController)

// Debug route to log all unmatched requests
app.use('*', (req, res, next) => {
    console.log(`Unmatched route: ${req.method} ${req.originalUrl}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    res.status(404).json({ 
        message: 'Route not found',
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date().toISOString()
    });
});

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