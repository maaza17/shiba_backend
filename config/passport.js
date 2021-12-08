const jwtStrategy = require('passport-jwt').Strategy
const extractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const userModel = require('../models/User').userModel
const keys = require('../config/keys')

const options = {}
options.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey

module.exports = passport => {
    passport.use(
        new jwtStrategy(options, (jwt_payload, done)=>{
            userModel.findById(jwt_payload.id)
                .then(user => {
                    if(user){
                        return done(null, user)
                    } else{
                        return done(null, false)
                    }
                })
                .catch(err => console.log(err))
        })
    )
}