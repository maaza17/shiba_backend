const express = require('express')
const placeModel = require('../../models/Place')
const router = express.Router()

const reviewModel = require('../../models/Review')

function getAvgRating(arr){
    if(arr.length == 0){
        sum=0
        arr.forEach((review) => {
            sum += review.rating
        })
        return sum/arr.length
    } else {
        return 'No reviews yet'
    }
    
}

// add a review
router.post('/addreview', (req, res) => {
    const {author, place, rating, reviewText} = req.body

    const rev = new reviewModel({author, place, rating, reviewText})
    rev.save((err, review) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: err.message
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'Review added successfully!',
                data: review
            })
        }
    })
})

// get review by place
router.get('/getplacereviews', (req, res) => {
    placeModel.find({place: req.body.place}, (err, docs) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: err.message
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'Found reviews for place',
                data: {rating: getAvgRating(docs), reviews: docs}
            })
        }
    })
})

// get reviews by author
router.get('/getauthorreviews', (req, res) => {
    reviewModel.find({author: req.body.author}, (err, docs) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: err.message
            })
        } else {
            return res.status(200).json({
                error: false,
                message: 'Found reviews for author.',
                data: docs
            })
        }
    })
})


module.exports = router