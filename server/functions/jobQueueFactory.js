// Function for building job queue on mongo db


// ====== IMPORTS ======

const Job = require('../models/job.js');
const CompletedJob = require('../models/completedJob.js');
const mongoose = require('mongoose');


// ====== FUNCTIONS ======

function JobQueue (pushCallbackArray = [], shiftCallbackArray = []) {
    async function listener (currentJob = {"_id": ''}) {
        
        let finishedJob;
        if (currentJob["_id"]) {
            finishedJob = await CompletedJob.findOne({"_id": currentJob["_id"]});
        }
        if (finishedJob) {
            currentJob = {"_id": ''};
        }

        console.log('\nCurrent Job');
        console.log(currentJob);

        let available;

        // Update document in jobs collection with progress of current job
        if (currentJob["_id"]) {
            updateProgress(currentJob["_id"]);
        }

        // Check if stable diffusion is running and if it is currently processing a job
        try {
            diffusionRunning = await checkIfDiffusionRunning();
            available = await checkAvailable();
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }

        // If the next job is available, assign it. Otherwise assign null id
        let nextJob = {"_id": ''};

        if (available && !currentJob["_id"]) {
            try {
                nextJob = await getNextJob();
            } catch (err) {
                console.log(err);
                throw new Error(err);
            }
        }

        console.log('Next Job');
        console.log(nextJob);

        let readyToSubmit = false;

        if (available) {
            // No current job and a next job has been found
            if (!currentJob["_id"] && nextJob["_id"]) {
                readyToSubmit = true;
            }
        }

        if (readyToSubmit) {
            try {
                currentJob = nextJob;
                submitJob(currentJob);
            } catch (err) {
                console.log(err);
                throw new Error(err);
            }
        }

        setTimeout(listener.bind(this, currentJob), 1000);

        // LISTENER FUNCTIONS

        async function updateProgress (jobId) {
            try {
                const workingDoc = await Job.findById(jobId);
                if (workingDoc) {
                    const response = await fetch('http://127.0.0.1:7860/sdapi/v1/progress');
                    const result = await response.json();
                    workingDoc.progress = result.progress;
                    workingDoc.save();
                }
                } catch (err) {
                console.log(err);
                throw new Error(err);
            }
        }

        async function submitJob (job) {

            try {
                console.log(this);
                console.log('SUBMITTING JOB');
                console.log('Running next job with id: ' + job["_id"]);
                const response = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: job.prompt
                    })
                });
                const result = await response.json();

                console.log('JOB FINISHED');
                console.log(result);
                console.log('Assigning move job');
                await moveJob(job["_id"], result.images[0]);
                console.log('Move job completed');
                currentJob = {"_id": ''};
                return result;
            } catch (err) {
                console.log(err);
                throw new Error(err);
            }

            async function moveJob (id, image) {
                try {
                    console.log('MOVING JOB TO COMPLETED JOBS');
                    const oldJob = await Job.findOne(id);
                    const completedJob = new CompletedJob({
                        _id: new mongoose.Types.ObjectId(id),
                        type: oldJob.type,
                        userId: oldJob.userId,
                        date: oldJob.date,
                        prompt: oldJob.prompt,
                        progress: 1,
                        image: image
                    })
                    console.log('Completed job to be saved:');
                    console.log(completedJob);
                    const result = await completedJob.save();
                    console.log('Save result:');
                    console.log(result);
                    console.log('Removing job with id:' + id);
                    await Job.findByIdAndDelete(id);
                    console.log('DONE');
                } catch (err) {
                    console.log(err);
                }
            }
        }

        async function getNextJob () {
            try {
                const jobs = await Job.find({}).sort({"date": 1});
                if (jobs[0]){
                    return jobs[0];
                } else {
                    return {"_id": ''}
                }
            } catch (err) {
                console.log(err);
                throw new Error(err);
            }
        }

        async function checkAvailable () {
            try {
                const response = await fetch('http://127.0.0.1:7860/sdapi/v1/progress');
                const result = await response.json();
                if (result.state.job_count) {
                    return false
                } else {
                    return true
                }
            } catch (err) {
                return false;
            }
        }

        async function checkIfDiffusionRunning () {
            try {
                const response = await fetch('http://127.0.0.1:7860/internal/ping');
                const result = await response.json();
                return true;
            } catch (err) {
                return false;
            }
        }
    }

    async function getJobUpdate (jobId) {
        try {
            const result = await Job.findOne({"_id": jobId});

            let index = null;
            if (result) {
                const jobs = await Job.find({}).sort({date: 1});

                for (let i = 0; i < jobs.length; i++) {
                    if (jobs[i]["_id"].toString() === jobId) {
                        index = i;
                    }
                }

                console.log(jobs);
            }

            let response = {
                jobId,
                complete: false,
                progress: 0,
                prompt: result.prompt,
                type: result.type,
                date: result.date
            };

            if (index != null) {
                response.placeInQueue = index;
            }

            return response;
        } catch (err) {
            throw new Error(err);
        }
    }

    async function push (req, type, prompt) {
        if (pushCallbackArray.length) {
            for (i = 0; i < pushCallbackArray.length; i++) {
                pushCallbackArray[i]();
            }
        }

        // SWAP WITH USER ID AFTER LOGIN IMPLEMENTED
        const mockUser = 'guest';


        let result;
        try {
            const newJob = new Job({
                type,
                prompt,
                userId: mockUser
            });

            result = await newJob.save();
        } catch (err) {
            throw new Error(err);
        }
        return result._id.toString();

    }

    function shift () {

        if (shiftCallbackArray.length) {
            for (i = 0; i < shiftCallbackArray.length - 1; i++) {
                shiftCallbackArray[i]();
            }
        }

        return this.queue.shift();
    }

    return {
        push,
        shift,
        listener,
        getJobUpdate,
        queue: []
    }
}


// ====== EXPORTS ======

module.exports = JobQueue