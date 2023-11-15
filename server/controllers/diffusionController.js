// Controller for diffusion route

// ====== IMPORTS ======

const fs = require('fs');

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

async function apiTxt2Img (req, res) {
    console.log(req.jobQueue);
    req.jobQueue.push({
        type: 'test',
        date: new Date()
    });
    console.log('API TXT2IMG');
    console.log(req.jobQueue.queue);
    res.json({
        msg: 'text api route success'
    });
}

function jobs (req, res) {
    res.json({
        jobs: req.jobQueue.queue
    });
}

// ====== EXPORTS ======

module.exports = {
    diffusionPage,
    txt2Img,
    apiTxt2Img,
    jobs
}