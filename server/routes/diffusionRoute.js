// Diffusion route

// ====== IMPORTS ======

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');


// Controller
const controller = require('../controllers/diffusionController.js');

// Validation array
const reqKeyValidate = [
    check('origin', 'origin not valid').trim().escape(),
    check('email', 'email not valid').isEmail().trim().escape()
]

// ====== ROUTES ======

router.get('/', controller.diffusionPage);

router.post('/txt2Img', controller.txt2Img);

router.get('/request_key', controller.requestKeyPage);
router.post('/request_key', reqKeyValidate, controller.requestKey);

router.post('/api/txt2Img', controller.apiTxt2Img);

router.get('/api/jobs', controller.jobs);


router.post('/api/job_update', controller.apiJobUpdate);

router.use('/api/*', controller.apiFourOhFour);

module.exports = router;