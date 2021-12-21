const mongoose = require('mongoose')
const userSchema = require('./User')

const placeSchema = ({
    place_name: {
        type: String,
        required: true,
    },
    lng: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    images: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true,
        max: 500
    },
    website: {
        type: String,
        required: true,
        default: 'Not Available'
    },
    is_approved: {
        type: Boolean,
        default: false,
        required: true
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

const placeModel = new mongoose.model('place', placeSchema)

module.exports = placeModel