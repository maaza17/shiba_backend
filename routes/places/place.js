const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const placeSchema = require('../../models/Place')
const placeModel = new mongoose.model('place', placeSchema)













module.exports = router