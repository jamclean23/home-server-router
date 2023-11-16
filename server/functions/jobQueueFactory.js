// Function for building job queue on mongo db


// ====== IMPORTS ======

const Job = require('../models/job.js');


// ====== FUNCTIONS ======

function JobQueue (pushCallbackArray = [], shiftCallbackArray = [], listenerObj = {}) {

    async function listener () {
        console.log('Listener tick');

        let diffusionRunning;
        let available;

        try {
            diffusionRunning = await checkIfDiffusionRunning();
            available = await checkAvailable();
        } catch (err) {
            throw new Error(err);
        }

        let nextJob = null;

        if (available) {
            try {
                nextJob = await getNextJob();
            } catch (err) {
                throw new Error(err);
            }
        }

        let result;

        if (nextJob) {
            try {
                result = await submitJob(nextJob);
                console.log(result);
            } catch (err) {
                throw new Error(err);
            }
        }

        console.log({
            diffusionRunning,
            available
        });

        setTimeout(listener.bind(this), 1000);

        async function submitJob (job) {
            try {
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
                await moveJob(job["_id"]);
                return result;
            } catch (err) {
                throw new Error(err);
            }

            async function moveJob (id) {
                try {
                    console.log('Removing job with id:' + id);
                    await Job.findByIdAndDelete(id);
                } catch (err) {
                    console.log(err);
                }
            }
        }

        async function getNextJob () {
            const jobs = await Job.find({}).sort({"date": 1});
            return jobs[0];
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