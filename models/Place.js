const mongoose = require('mongoose')
// const userSchema = require('./User')

const placeSchema = ({
    place_name: {
        type: String,
        required: true,
    },
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        max: 500
    },
    website: {
        type: String,
        required: true,
        default: 'Not Available'
    },
    is_deleted: {
        type: Boolean,
        default: false,
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema'
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

module.exports = placeSchema