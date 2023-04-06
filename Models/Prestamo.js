const mongoose = require('../DB/connection.js')

const Schema = mongoose.Schema

const Prestamo = new Schema({
    cedula: {type: String, required: true},
    paymentSchedule: {type: String, required: true},
    prestamoAmount: {type: Number, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    totalToPay: {type: Number, required: true},
    interestEarn: {type: Number, required: true},
    amountOfPayments: {type: Number, required: true},
    amountPerPayment: {type: Number, required: true}
})

const prestamoModel = mongoose.model('Prestamo', Prestamo)

module.exports = prestamoModel