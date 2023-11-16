// Schema for new job request


// ====== IMPORTS ======

const mongoose = require('mongoose');


// ====== SCHEMA ======

const jobSchema = new mongoose.Schema({
    type: {
        type: String, 
        enum: ['txt2Img', 'img2Img'],
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    prompt: {
        type: String,
        required: true
    }

  });

  const Job = mongoose.model('Job', jobSchema);


// ====== EXPORTS ======

  module.exports = Job;