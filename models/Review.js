const mongoose = require('mongoose')
const userSchema = require('./User')
const placeSchema = require('./Place')

const reviewSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema'
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'placeSchema'
    },
    rating: {
        type: Number,
        required: true
    },
    reviewText: {
        type: String,
        required: true,
        max: 300
    },
    created_at: {
        type: Date,
        default: Date.now(),
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false,
        required: true
    }
})

const reviewModel = new mongoose.model('review', reviewSchema)

module.exports = reviewModel