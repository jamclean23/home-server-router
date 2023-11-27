// Send emails with nodemailer using server0424.lol@gmail.com


// ====== IMPORTS ======

const path = require('path');

const nodemailer = require('nodemailer');

// Dotenv
require('dotenv').config({
    // Replace with pathname to your .env
    path: path.join(__dirname, '../../config/.env')
});


// ====== GLOBAL VARS ======

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_APP_PASS,
  },
});


// ====== FUNCTIONS ======

/**
 * 
 * @param {object} mailOptions - mail options (to, subject, text, html)
 */

async function sendMail (mailOptions) {

    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (err) {
        console.log(err);
        return err;
    }
}


// ====== EXPORTS ======

module.exports = sendMail;