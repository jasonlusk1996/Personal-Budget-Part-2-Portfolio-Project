const express = require('express');
const app = express();
const envelopes = require('./envelopes.js');
app.use(express.json());

app.get('/envelopes', (req, res) => {
    res.send(envelopes);
});

app.post('/envelopes', (req, res) => {
    const { name, budget } = req.body || {};
    if(!name || !budget) {
        return res.status(400).send('Name and budget are required');
    }
    envelopes.push({ id: envelopes.length + 1, name, budget, spent: 0 });
    res.status(201).send('Envelope created successfully');
});

module.exports = app;