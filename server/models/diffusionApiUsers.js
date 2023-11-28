// Schema for new job request


// ====== IMPORTS ======

const mongoose = require('mongoose');


// ====== SCHEMA ======

const diffusionApiKeySchema = new mongoose.Schema({
    key: {
        type: String, 
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    origin: {
        type: String,
        required: true
    },
    notified: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true
    }
  });

  const DiffusionApiKey = mongoose.model('diffusion_keys', diffusionApiKeySchema);


// ====== EXPORTS ======

  module.exports = DiffusionApiKey;