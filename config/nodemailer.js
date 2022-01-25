const nodemailer = require('nodemailer')
const {nodemaileruser, nodemailerpass} = require('./keys')

var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: nodemaileruser,
      pass: nodemailerpass
    },
    tls: {
      rejectUnauthorized: false
    }
 });

 module.exports = transport;