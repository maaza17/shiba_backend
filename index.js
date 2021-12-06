const express = require('express')
const mongoose = require('mongoose')
const app = express()
const user = require('./routes/users/user')
const place = require('./routes/places/place')


app.use(express.urlencoded({extended: true}))

//Database
mongoose.connect("mongodb://localhost:27017/shibainuDB", {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Database Connected");
});

app.use(express.json())
app.use(user)
app.use(place)





const port = 9002 || process.env.PORT
app.listen(port, () => {
    console.log('Server running on port ' + port)
})

