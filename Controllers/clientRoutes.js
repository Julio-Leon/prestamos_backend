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
        telephoneNumber: req.body.telephoneNumber && req.body.telephoneNumber.length > 0 ? parseInt(req.body.telephoneNumber) : undefined,
        celularNumber: parseInt(req.body.celularNumber),
        address: {
            number: req.body.number ? parseInt(req.body.number) : undefined,
            street: req.body.street,
            apartment: req.body.apartment,
            county: req.body.county,
            state: req.body.state,
            zipCode: req.body.zipCode ? parseInt(req.body.zipCode) : undefined
        },
        recommendedBy: req.body.recommendedBy || req.body.recommendation
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

// UPDATE client by cedula
router.put('/:cedula', async (req, res, next) => {
    try {
        const clientObject = {
            cedula: req.body.cedula,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            department: req.body.department,
            telephoneNumber: req.body.telephoneNumber && req.body.telephoneNumber.length > 0 ? parseInt(req.body.telephoneNumber) : undefined,
            celularNumber: parseInt(req.body.celularNumber),
            address: {
                number: req.body.number ? parseInt(req.body.number) : undefined,
                street: req.body.street,
                apartment: req.body.apartment,
                county: req.body.county,
                state: req.body.state,
                zipCode: req.body.zipCode ? parseInt(req.body.zipCode) : undefined
            },
            recommendedBy: req.body.recommendedBy || req.body.recommendation
        }

        const updatedClient = await Client.findOneAndUpdate(
            { cedula: req.params.cedula },
            clientObject,
            { new: true, runValidators: true }
        )

        if (!updatedClient) {
            return res.status(404).json({ message: 'Cliente no encontrado' })
        }

        res.json(updatedClient)
    } catch (error) {
        next(error)
    }
})

// DELETE client by cedula
router.delete('/:cedula', async (req, res, next) => {
    try {
        const deletedClient = await Client.findOneAndDelete({ cedula: req.params.cedula })

        if (!deletedClient) {
            return res.status(404).json({ message: 'Cliente no encontrado' })
        }

        res.json({ message: 'Cliente eliminado exitosamente', client: deletedClient })
    } catch (error) {
        next(error)
    }
})

module.exports = router

