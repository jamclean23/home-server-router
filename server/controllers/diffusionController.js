// Controller for diffusion route


// ====== IMPORTS ======

// System
const fs = require('fs');
const path = require('path');

// Keys
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

// Encryption
const bcrypt = require('bcryptjs');

// Validation/sanitation
const { validationResult } = require('express-validator');

// Email
const sendMail = require('../functions/sendMail.js');

// Ejs async rendering
const renderEjsAsync = require('../functions/renderEjsAsync.js');

// Models
const diffusionApiUsers = require('../models/diffusionApiUsers.js');


// ====== FUNCTIONS ======

function diffusionPage (req, res) {
    res.render('diffusion');
}

async function txt2Img (req, res) {
    console.log('*********');
    console.log('Text to image request');
    console.dir(req.body, {depth: null});
    console.log(`Prompt: ${req.body.prompt}`);

    if (req.body.prompt) {
        let result;
        try {
            console.log('Generating Image');
            const response = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: req.body.prompt
                })
            });
            result = await response.json();
            console.log('Done Generating');
        } catch (err) {
            console.log(err);
            res.status(500).send();
            return;
        }

        fs.writeFileSync(`./test.txt`, result.images[0], (err) => {
            console.log(err);
        });

        res.json({
            msg: 'Image generation successful',
            result
        });
    } else {
        res.status(400).send();
    }
}



function jobs (req, res) {
    res.json({
        jobs: req.jobQueue.queue
    });
}

async function apiTxt2Img (req, res) {
    console.log('NEW JOB REQUEST');

    console.log('Prompt:');
    console.log(req.body.prompt);

    try {
        const id = await req.jobQueue.push(req, 'txt2Img', req.body.prompt);
        console.log('Job added');   
        res.json({
            msg: 'test job added',
            jobId: id
        });
        return;
    } catch (err) {
        res.status(400).json({
            msg: 'Job not added',
            err: err
        });
    }

}

async function apiJobUpdate (req, res) {
    try {
        const result = await req.jobQueue.getJobUpdate(req.body.jobId);

        res.json(result);
    } catch (err) {
        res.status(404).json({
            msg: 'Error while requesting update',
            err: err.message
        });
    }
}

function requestKeyPage (req, res) {
    res.render('diffusionApiRequest');
}

async function requestKey (req, res) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()``});
    }

    const newKey = uuidv4();

    let emailTemplate;

    try {
        emailTemplate = await renderEjsAsync(
            path.join(__dirname, '../views/requestKeyConfEmail.ejs'),
            {
                key: newKey,
                origin: req.body.origin
            }
            );
    } catch (err) {
        console.log(err);
        res.status(400).send('Oops, something went wrong.');
    }

    if (!emailTemplate) {
        return;
    }

    const mailOptions = {
        to: req.body.email,
        subject: "Server0424 Diffusion Key",
        html: emailTemplate
    }

    try {
        sendMail(mailOptions);
    } catch (err) {
        console.log(err);
    }

    const newUser = new diffusionApiUsers({
        key: await bcrypt.hash(newKey, 10),
        origin: req.body.origin,
        email: req.body.email
    });


    try {
        await newUser.save();
    } catch (err) {
        res.status(400).json({
            error: err
        });
    }

    res.render('diffusionKeyConfirmation', {email: req.body.email, origin: req.body.origin});
}

function apiFourOhFour (req, res) {
    res.status(404).json({
        msg: 'Endpoint does not exist'
    })
}

// ====== EXPORTS ======

module.exports = {
    diffusionPage,
    requestKeyPage,
    requestKey,
    txt2Img,
    jobs,
    apiTxt2Img,
    apiJobUpdate,
    apiFourOhFour
}