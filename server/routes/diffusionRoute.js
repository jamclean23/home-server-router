// Diffusion route

// ====== IMPORTS ======

const express = require('express');
const router = express.Router();

// Controller
const controller = require('../controllers/diffusionController.js');

// ====== ROUTES ======

router.get('/', controller.diffusionPage);

router.post('/txt2Img', controller.txt2Img);

router.post('/api/txt2Img', controller.apiTxt2Img);

router.get('/api/jobs', controller.jobs);

router.post('/api/job_update', controller.apiJobUpdate);

router.use('/api/*', controller.apiFourOhFour);

module.exports = router;