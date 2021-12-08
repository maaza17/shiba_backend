const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

const users = require('./routes/api/users')

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const db = require('./config/keys').mongoURI
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('Database connected successfully'))
.catch((err) => console.log(err))

app.use(passport.initialize())

require('./config/passport')(passport)

app.use('/api/users', users)

const port = 9002 || process.env.PORT
app.listen(port, () => console.log('Server is live on port ' + port + '!'))