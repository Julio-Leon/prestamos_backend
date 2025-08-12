const express = require('express')
const router = express.Router()
const Prestamo = require('../Models/Prestamo.js')
const Client = require('../Models/Client.js')

router.get('/', async (req, res, next) => {
    try {
        const prestamos = await Prestamo.find()
        res.json(prestamos)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    const newPrestamoTemp = {
        cedula: req.body.cedula,
        paymentSchedule: req.body.paymentSchedule,
        prestamoAmount: Number(req.body.prestamoAmount),
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        totalToPay: Number(req.body.totalToPay),
        interestEarn: Number(req.body.interestEarn),
        amountOfPayments: Number(req.body.amountOfPayments),
        amountPerPayment: Number(req.body.amountPerPayment)
    }

    try {
        const newPrestamo = await Prestamo.create(newPrestamoTemp)
        res.json(newPrestamo)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const updatedPrestamoData = {
            cedula: req.body.cedula,
            paymentSchedule: req.body.paymentSchedule,
            prestamoAmount: Number(req.body.prestamoAmount),
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            totalToPay: Number(req.body.totalToPay),
            interestEarn: Number(req.body.interestEarn),
            amountOfPayments: Number(req.body.amountOfPayments),
            amountPerPayment: Number(req.body.amountPerPayment)
        }

        const updatedPrestamo = await Prestamo.findByIdAndUpdate(
            req.params.id,
            updatedPrestamoData,
            { new: true, runValidators: true }
        )

        if (!updatedPrestamo) {
            return res.status(404).json({ message: 'Préstamo no encontrado' })
        }

        res.json(updatedPrestamo)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedPrestamo = await Prestamo.findByIdAndDelete(req.params.id)

        if (!deletedPrestamo) {
            return res.status(404).json({ message: 'Préstamo no encontrado' })
        }

        res.json({ message: 'Préstamo eliminado exitosamente', prestamo: deletedPrestamo })
    } catch (error) {
        next(error)
    }
})

module.exports = router

