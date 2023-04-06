const express = require('express')
const router = express.Router()
const Prestamo = require('../Models/Prestamo.js')


router.get('/', async (req, res) => {
    try {
        const clients = await Prestamo.find()
        res.json(clients)
    } catch (error) {
        next(error)
    }
})

module.exports = router

