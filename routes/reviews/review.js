const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const reviewSchema = require('../../models/Review')
const reviewModel = new mongoose.model('review', reviewSchema)













module.exports = router