const mongoose = require('../DB/connection.js')

const Schema = mongoose.Schema

const Client = new Schema({
    cedula: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    department: {type: String, required: true},
    telephoneNumber: Number,
    celularNumber: {type: Number, required: true},
    address: {type: {
        number: Number,
        street: String,
        apartment: String,
        county: String,
        state: String,
        zipCode: Number
    }, required: true},
    recommendedBy: {type: String, required: true}
})

const clientModel = mongoose.model('Client', Client)

module.exports = clientModel