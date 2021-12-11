const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')

// Load input validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// Load User Model
const userModel = require('../../models/User')
const passport = require('passport')


// Register POST Route
// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res)=>{
    
    const  {errors, isValid} = validateRegisterInput(req.body)

// Check validation
    if(!isValid) {
        return res.status(400).json(errors)
    }

    userModel.findOne({email: req.body.email}, (err, user)=>{
        if(user){
            return res.status(400).json({ email: 'Email already in use!'})
        } else {
            const newUser = new userModel({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err
                    newUser.password = hash
                    newUser
                        .save()
                        .then(user => res.status(200).json({
                            error: false,
                            message: 'User successfully registered!'
                        }))
                        .catch(err => console.log(err))
                })
            })
        }
    })
})


// Login POST Route
// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', (req, res)=>{

    const {errors, isValid} = validateLoginInput(req.body)

    // Check validation
    if(!isValid){
        return res.status(400).json(errors)
    }

    const email = req.body.email
    const password = req.body.password

    // Find User by email
    userModel.findOne({email: email, is_deleted: false})
        .then(user => {
            // Check if user exists
            if(!user){
                return res.status(400).json({emailnotfound: 'Email not found!'})
            }

            // Check password
            bcrypt.compare(password, user.password).then(isMatch => {
                if(isMatch){
                    // User matched, create jwt payload
                    const payload = {
                        id: user._id,
                        name: user.name
                    }

                    // Sign token
                    jwt.sign(payload, keys.secretOrKey, { expiresIn: 31556926 }, (err, token)=>{
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        })
                    })
                } else {
                    return res.status(401).json({passwordincorrect: 'Password incorrect!'})
                }
            })
        })
})


// Update user password
router.post('/updatepassword', (req, res) => {
    const {email, currPassword, newPassword} = req.body

    userModel.findOne({email: email, is_deleted: false}, (err, doc) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: 'Unable to update password!'
            })
        } else if (!doc){
            return res.status(200).json({
                error: false,
                message: 'User not found!'
            })
        }else {
            bcrypt.compare(currPassword, doc.password).then(isMatch => {
                if(isMatch){
                    bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(newPassword, salt, (err, hash)=>{
                            if(err) throw err
                            userModel.findOneAndUpdate({email: email}, {password: hash}, (err, newDoc) => {
                                if(err){
                                    return res.status(400).json({
                                        error: true,
                                        message: err.message,
                                        data: err
                                    })
                                } else {
                                    return res.status(200).json({
                                        error: false,
                                        message: 'Password updated successfully!'
                                    })
                                }
                            })
                        })
                    })
                } else {
                    return res.status(401).json({
                        error: true,
                        message: 'Old password is incorrect!'
                    })
                }
            })
        }
    })

})


// Update name of user
router.post('/updatename', (req, res) => {
    const {email, newName} = req.body

    userModel.findOneAndUpdate({email: email, is_deleted: false}, {name: newName}, (err, doc) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: err.message,
                data: err
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'Name updated successfully!'
            })
        }
    })
})


// Delete user
router.post('/deleteuser', (req, res) => {
    const email = req.body.email
    userModel.findOneAndUpdate({email: email, is_deleted: false}, {is_deleted: true}, (err, doc) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: err.message
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'Soft delete successful!'
            })
        }
    })
})

// Undo delete user
router.post('/undodeleteuser', (req, res) => {
    const email = req.body.email
    userModel.findOneAndUpdate({email: email, is_deleted: true}, {is_deleted: false}, (err, doc) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: err.message
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'Undo delete successful!'
            })
        }
    })
})

// Get all users
router.get('/usersall', (req, res) => {
    userModel.find({is_deleted: false}, (err, docs) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: err.message
            })
        } else if(docs.length==0){
            return res.status(200).json({
                error: false,
                message: 'No users found!'
            })
        }else {
            return res.status(200).json({
                error: false,
                message: 'Found registered users!',
                data: docs
            })
        }
    })
})

// Get deleted users
router.get('/getdeletedusers', (req, res) => {
    userModel.find({is_deleted: true}, (err, docs) => {
        if(err){
            res.status(400).json({
                error: true,
                message: err.message
            })
        } else {
            res.status(200).json({
                error: false,
                message: 'Found deleted users!',
                data: docs
            })
        }
    })
})

module.exports = router