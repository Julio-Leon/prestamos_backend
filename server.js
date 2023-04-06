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

app.listen(4000, () => {
    console.log(`Server listening on port: ${PORT}`)
})