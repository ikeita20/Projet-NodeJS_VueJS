const mongoose = require('mongoose')

module.exports.RequestSchema = new mongoose.Schema({
    ip: {
        type: String,
    },
    path: {
        type: String,
    },
    hostname: {
        type: String,
    },
    lang: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
})

module.exports.Request = new mongoose.model('Request', this.RequestSchema)