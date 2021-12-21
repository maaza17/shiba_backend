const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: false,
        enum: ["user", "admin"],
        default:"user",
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    rewardPoints: {
        type: Number,
        default: 100
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
})

const userModel = new mongoose.model('user', userSchema)

module.exports = userModel