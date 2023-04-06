const mongoose = require('mongoose')

const MONGO_STRING = process.env.MONGO_STRING

mongoose.connect(MONGO_STRING)
    .then(() => {
        console.log('Connected to Database')
    })
    .catch((err) => {
        console.error(err)
    })

module.exports = mongoose