// Middleware for checking user keys for diffusion api endpoints

// ====== IMPORTS ======

const DiffusionApiUsers = require('../models/diffusionApiUsers');
const bcrypt = require('bcryptjs');


// ====== FUNCTIONS ======

async function diffusionKeyAuth (req, res, next) {
    const origin = req.headers.origin.split('//')[1].trim();
    const key = req.get('key');
    let users;
    try {
        users = await DiffusionApiUsers.find({'origin': origin}, null, {strictQuery: false});
    } catch (err) {
        console.log(err);
    }

    console.log('Origin: ' + origin);
    console.log('Key: ' + key);
    console.log('Users: ');
    console.log(users);

    if (!users.length) {
        res.status(401).json({
            msg: 'Origin not found. Please submit a key request.'
        });
        return;
    }

    
    if (!key) {
        res.status(401).json({
            msg: 'Key not provided'
        });
        return;
    }
    
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const result = await bcrypt.compare(key, user.key);
        console.log('Keys match?');
        console.log(result);
    }



    next();
}


// ====== EXPORTS ======

module.exports = diffusionKeyAuth