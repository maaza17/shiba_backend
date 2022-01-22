const nodemailer = require('nodemailer')
const {nodemaileruser, nodemailerpass} = require('./keys')

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: nodemaileruser,
      pass: nodemailerpass
    }
 });

 module.exports = transport;