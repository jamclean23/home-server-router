const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('diffusion');
});

router.get('/txt2Img', (req, res) => {
    console.log('TXT2IMG TEST');
    res.json({
        msg: 'TEST ROUTE SUCCESS txt2Img'
    });
});

module.exports = router;