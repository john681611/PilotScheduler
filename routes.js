const express = require('express');
const router = new express.Router();
const data = require('./data/data');


router.post('/availability', (req, res) => {
   res.status(200).send('ok')
});

router.post('/book', (req, res) => {
    res.status(200).send('ok')
});


module.exports = router