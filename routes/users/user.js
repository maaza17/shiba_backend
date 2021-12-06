const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const userSchema = require('../../models/User')
const userModel = new mongoose.model('user', userSchema)













module.exports = router