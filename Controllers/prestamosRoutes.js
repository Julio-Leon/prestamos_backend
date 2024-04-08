const express = require('express')
const router = express.Router()
const Prestamo = require('../Models/Prestamo.js')
const Client = require('../Models/Client.js')

router.get('/', async (req, res) => {
    try {
        const prestamos = await Prestamo.find()
        res.json(prestamos)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    const newPrestamoTemp = {
        paymentSchedule: req.body.paymentSchedule,
        prestamoAmount: Number(req.body.prestamoAmount),
        totalToPay: Number(req.body.totalToPay),
        interestEarn: Number(req.body.interestEarn),
        amountOfPayments: Number(req.body.amountOfPayments),
        amountPerPayment: Number(req.body.amountPerPayment),
        startDate: req.body.startDate,
        endDate: req.body.endDate
    }

    

    try {
        const newPrestamo = await Prestamo.create(newPrestamoTemp)
        res.json(newPrestamo)
    } catch (error) {
        next(error)
    }
})

module.exports = router

