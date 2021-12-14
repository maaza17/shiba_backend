const express = require('express')
const router = express.Router()

const placeModel = require('../../models/Place')

// Add place
router.post('/addplace', (req, res) => {
    
    const newPlace = new placeModel({place_name: req.body.place_name, lon: req.body.lon, lat: req.body.lat, category: req.body.category,
        images: req.body.images, desc: req.body.desc, website: req.body.website, createdBy: req.body.createdBy})
    
    newPlace.save((err, place) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: err.message
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'Place added! Pending approval',
                data: place
            })
        }
    })   
})

// Get all places
router.get('/getapprovedplaces', (req, res) => {
    placeModel.find({is_deleted: false, is_approved: true}, (err, docs) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: err.message
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'Places found!',
                data: docs
            })
        }
    })
})

// Get nearby places within a 10km radius
router.get('/getnearby', (req, res) => {
    const {lon, lat} = req.body

    placeModel.find({is_deleted: false, is_approved: true}).and([
        {$and:[{lat: {$gte: Number(lat)-0.09009}},{lat: {$lte: Number(lat)+0.09009}}]},
        {$and:[{lon: {$gte: Number(lon)-0.09009}},{lon: {$lte: Number(lon)+0.09009}}]}
    ]).exec((err, docs) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: err.message
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'Places within 10km found!',
                data: docs
            })
        }
    })
})

module.exports = router