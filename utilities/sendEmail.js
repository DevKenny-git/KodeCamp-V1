const sendMail = require("nodemailer");

const options = {
    service: "Gmail",
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
   
}

const send = sendMail.createTransport(options);

module.exports = {send};