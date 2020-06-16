const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', require('./routes'));

app.use(function (req, res) {
    res.status(404).send('This isn\'t the page your looking for!');
});

app.use(function (err, req, res) {
    console.error(err)
    res.status(500).send('Something broke!');
});

module.exports = app