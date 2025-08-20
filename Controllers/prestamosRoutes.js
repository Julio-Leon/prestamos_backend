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
        interestToPay: Number(req.body.interestToPay || req.body.interestEarn),
        capitalRemaining: Number(req.body.capitalRemaining || req.body.prestamoAmount),
        amountOfPayments: Number(req.body.amountOfPayments),
        amountPerPayment: Number(req.body.amountPerPayment),
        paymentsMade: Number(req.body.paymentsMade || 0),
        status: req.body.status || 'active'
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
            interestToPay: Number(req.body.interestToPay || req.body.interestEarn),
            capitalRemaining: Number(req.body.capitalRemaining || req.body.prestamoAmount),
            amountOfPayments: Number(req.body.amountOfPayments),
            amountPerPayment: Number(req.body.amountPerPayment),
            paymentsMade: Number(req.body.paymentsMade || 0),
            status: req.body.status || 'active'
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

// New route for processing payments
router.post('/:id/payment', async (req, res, next) => {
    try {
        const { capitalPayment, interestPayment } = req.body;
        
        const prestamo = await Prestamo.findById(req.params.id);
        if (!prestamo) {
            return res.status(404).json({ message: 'Préstamo no encontrado' });
        }

        // Update the loan balances
        const updatedData = {
            capitalRemaining: Math.max(0, prestamo.capitalRemaining - Number(capitalPayment)),
            interestToPay: Math.max(0, prestamo.interestToPay - Number(interestPayment)),
            paymentsMade: prestamo.paymentsMade + 1,
            lastPaymentDate: new Date()
        };

        // Check if loan is fully paid
        if (updatedData.capitalRemaining === 0 && updatedData.interestToPay === 0) {
            updatedData.status = 'completed';
        }

        const updatedPrestamo = await Prestamo.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Pago procesado exitosamente',
            prestamo: updatedPrestamo,
            paymentDetails: {
                capitalPayment: Number(capitalPayment),
                interestPayment: Number(interestPayment),
                totalPayment: Number(capitalPayment) + Number(interestPayment)
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router

