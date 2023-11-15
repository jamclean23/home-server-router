// Diffusion route

// ====== IMPORTS ======

const express = require('express');
const router = express.Router();

// Controller
const controller = require('../controllers/diffusionController.js');

// ====== ROUTES ======

router.get('/', controller.diffusionPage);

router.post('/txt2Img', controller.txt2Img);

module.exports = router;