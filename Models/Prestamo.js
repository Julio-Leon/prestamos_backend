const mongoose = require('../DB/connection.js')

const Schema = mongoose.Schema

const Prestamo = new Schema({
    cedula: {type: String, required: true},
    paymentSchedule: {type: String, required: true},
    prestamoAmount: {type: Number, required: true},
    startDate: {type: String, required: true},
    endDate: {type: String, required: true},
    totalToPay: {type: Number, required: true},
    interestEarn: {type: Number, required: true},
    interestToPay: {type: Number, required: true, default: function() { return this.interestEarn; }},
    capitalRemaining: {type: Number, required: true, default: function() { return this.prestamoAmount; }},
    amountOfPayments: {type: Number, required: true},
    amountPerPayment: {type: Number, required: true},
    paymentsMade: {type: Number, default: 0},
    lastPaymentDate: {type: Date, default: null},
    status: {type: String, enum: ['active', 'completed', 'defaulted'], default: 'active'}
})

const prestamoModel = mongoose.model('Prestamo', Prestamo)

module.exports = prestamoModel

// 00000001
// Monthly
// 500