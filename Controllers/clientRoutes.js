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
    console.log(`PUT /clients/${req.params.cedula} - Update request received`);
    console.log('Request body:', req.body);
    
    try {
        const clientObject = {
            cedula: req.body.cedula,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            department: req.body.department,
            telephoneNumber: req.body.telephoneNumber && req.body.telephoneNumber.length > 0 ? parseInt(req.body.telephoneNumber) : undefined,
            celularNumber: req.body.celularNumber ? parseInt(req.body.celularNumber) : undefined,
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

        console.log('Processed client object:', clientObject);

        const updatedClient = await Client.findOneAndUpdate(
            { cedula: req.params.cedula },
            clientObject,
            { new: true, runValidators: true }
        )

        if (!updatedClient) {
            console.log(`Client with cedula ${req.params.cedula} not found`);
            return res.status(404).json({ message: 'Cliente no encontrado' })
        }

        console.log('Client updated successfully:', updatedClient);
        res.json(updatedClient)
    } catch (error) {
        console.error('Error in PUT /clients/:cedula:', error);
        next(error)
    }
})

// DELETE client by cedula
router.delete('/:cedula', async (req, res, next) => {
    console.log(`DELETE /clients/${req.params.cedula} - Delete request received`);
    
    try {
        const deletedClient = await Client.findOneAndDelete({ cedula: req.params.cedula })

        if (!deletedClient) {
            console.log(`Client with cedula ${req.params.cedula} not found for deletion`);
            return res.status(404).json({ message: 'Cliente no encontrado' })
        }

        console.log('Client deleted successfully:', deletedClient);
        res.json({ message: 'Cliente eliminado exitosamente', client: deletedClient })
    } catch (error) {
        console.error('Error in DELETE /clients/:cedula:', error);
        next(error)
    }
})

module.exports = router

