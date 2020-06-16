const express = require('express');
const router = new express.Router();
const moment = require('moment');
const book = require('./book')


router.post('/availability', (req, res) => {
   res.status(200).send('ok')
});

router.post('/book', (req, res) => {
    if(!req.body || !req.body.location) return res.status(400).send()
    const result = book({
        ...req.body,
        depDateTime: moment(req.body.depDateTime),
        returnDateTime: moment(req.body.returnDateTime)
    })
    if(result) {
        res.status(200).send(req.body)
    } else {
        res.status(500).send('Conflits with existing booking') //conflict
    }
});


module.exports = router