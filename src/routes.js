const express = require('express');
const router = new express.Router();
const moment = require('moment');
const book = require('./book')
const availability = require('./availability')


router.post('/availability', (req, res) => {
    if(!req.body || !req.body.location) return res.status(400).send() //would replace with schema check
    const result = availability(
        {
            ...req.body,
            depDateTime: moment(req.body.depDateTime),
            returnDateTime: moment(req.body.returnDateTime)
        })
        if(result) {
            res.status(200).send({ pilotId: result})
        } else {
            res.status(500).send('Request could not be fullfilled') //conflict/no-pilot
        }
});

router.post('/book', (req, res) => {
    if(!req.body || !req.body.location) return res.status(400).send() //would replace with schema check
    const result = book({
        ...req.body,
        depDateTime: moment(req.body.depDateTime),
        returnDateTime: moment(req.body.returnDateTime)
    })
    if(result) {
        res.status(200).send(req.body)
    } else {
        res.status(500).send('Request could not be fullfilled') //conflict/no-pilot
    }
});


module.exports = router