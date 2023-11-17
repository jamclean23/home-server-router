// Schema for new job request


// ====== IMPORTS ======

const mongoose = require('mongoose');


// ====== SCHEMA ======

const jobSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
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
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    }

  });

  const CompletedJob = mongoose.model('completed_jobs', jobSchema);


// ====== EXPORTS ======

  module.exports = CompletedJob;