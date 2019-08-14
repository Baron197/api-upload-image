const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'baronhartono@gmail.com',
        pass: 'finagxravcbqheyx'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter;