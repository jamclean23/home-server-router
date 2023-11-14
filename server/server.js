// SERVER


// ====== IMPORTS ======

// System
const path = require('path');
const fs = require('fs');

// Express
const express = require('express');
const session = require('express-session');

// Https
const https = require('https');
const cors = require('cors');

const diffusionRoute = require('./routes/diffusionRoute.js');


// ====== GLOBAL VARS ======

const HTTP_PORT = 80;
const HTTPS_PORT = 443;

// ====== FUNCTIONS ======

function startHttpServer () { 
    const app = express();
    
    app.use(cors());

    app.get('/.well-known/pki-validation/34E46AB8F586BC6409067BC8BA722B9B.txt', (req, res) => {
        res.sendFile('./cert_validation/34E46AB8F586BC6409067BC8BA722B9B.txt', { root: path.join(__dirname)}, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Sending File');
            }
        });
    })

    app.get('/*', (req, res) => {
        console.log('********************');
        console.log(`Http Request received, redirecting to https://www.server0424.lol${req.url}`);
        res.redirect(`https://server0424.lol${req.url}`);
        console.log('********************');
    });

    app.listen(HTTP_PORT, () => {
        console.log('Http Server Listening on port ' + HTTP_PORT);
    });
}

function startHttpsServer () {
    
    // Express Setup
    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));

    // Middleware
    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use((req, res, next) => {
        console.log(req.path);
        next();
    });

    app.get('/', (req, res) => {
        res.render('serverInfo');
    });

    app.use('/diffusion', diffusionRoute);

    https
    .createServer(
        {
            key: fs.readFileSync(path.join(__dirname, '/cert_validation/certificate', 'www_server0424_lol.key')),
            cert: fs.readFileSync(path.join(__dirname, '/cert_validation/certificate', "www_server0424_lol.crt")),
        },
        app)
    .listen(HTTPS_PORT, ()=> {
        console.log('Https Server listening on port ' + HTTPS_PORT);
    });
}

// ====== MAIN ======

startHttpServer();
startHttpsServer();