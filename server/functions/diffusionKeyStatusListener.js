// Listener for sending emails to approved 

// ====== IMPORTS ======

const DiffusionApiUsers = require('../models/diffusionApiUsers.js');
const sendMail = require('./sendMail.js');
const path = require('path');
const renderEjsAsync = require('../functions/renderEjsAsync.js');


// ====== FUNCTIONS ======

async function init () {
    const users = await DiffusionApiUsers.find({});

    if (!users.length) {
        setTimeout(init, 5000);
        return;
    }

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (!user.notified && user.approved) {

            user.notified = true;
            try {
                await sendMail({
                    to: user.email,
                    subject: 'Server0424 Key Approval',
                    html: await renderEjsAsync(
                        path.join(__dirname, '../views/diffusionKeyApprovedEmail.ejs'),
                        {
                            email: user.email,
                            origin: user.origin
                        }
                    )
                });
                await user.save();
            } catch (err) {
                console.log(err);
            }
        } else {
        }
    }

    setTimeout(init, 5000);
}

// ====== EXPORTS ======

module.exports = {
    init
}