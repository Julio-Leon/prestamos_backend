const express = require('express')
const router = express.Router()
const Client = require('../Models/Client.js')


router.get('/', async (req, res) => {
    try {
        const clients = await Client.find()
        res.json(clients)
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async (req, res, next) => {
    const clientObject = {
        cedula: req.body.cedula,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        department: req.body.department,
        telephoneNumber: req.body.telephoneNumber.length > 1 && parseInt(req.body.telephoneNumber),
        celularNumber: parseInt(req.body.celularNumber),
        address: {
            number: parseInt(req.body.number),
            street: req.body.street,
            apartment: req.body.apartment,
            county: req.body.county,
            state: req.body.state,
            zipCode: parseInt(req.body.zipCode)
        },
        recommendedBy: req.body.recommendedBy
    }
    console.log(clientObject)
    try {
        const newClient = await Client.create(clientObject)
        res.json(newClient)
    } catch (error) {
        next(error)
    }
})

router.get('/:cedula', async (req, res, next) => {
    try {
        res.json(await Client.findOne({ cedula: req.params.cedula }))
    } catch (error) {
        next(error)
    }
})

module.exports = router

