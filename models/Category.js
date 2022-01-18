const mongoose = require('mongoose')

const categorySchema = ({
    name: {
        type: String,
        required: true,
    }
})

const categoryModel = new mongoose.model('category', categorySchema)

module.exports = categoryModel