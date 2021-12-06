const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        max: 30
    },
    first_name: {
        type: String,
        required: true,
        max: 20
    },
    last_name: {
        type: String,
        required: true,
        max: 20
    },
    pass_hash: {
        type: String,
        required: true,
        max: 60,
        min: 8
    },
    is_deleted: {
        type: Boolean,
        default: false,
        required: true
    },
    rewardPoints: {
        type: Number,
        default: 20,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now(),
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now(),
        required: true
    }
})

module.exports = userSchema