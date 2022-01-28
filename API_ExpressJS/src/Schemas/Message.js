const mongoose = require('mongoose')

module.exports.MessageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    message: {
        type: String,
    },
    chat: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    ip: {
        type: String,
    },
    socket: {
        type: String,
    },
    headers: {
        type: Array,
    }
})

module.exports.Message = new mongoose.model('Message', this.MessageSchema)