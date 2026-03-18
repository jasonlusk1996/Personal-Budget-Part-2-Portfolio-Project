const express = require('express');
const app = express();
const envelopes = require('./envelopes.js');
const helper = require('./helper.js');
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

app.get('/envelopes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const envelope = helper.getEnvelopeById(id);
    if (!envelope) {
        return res.status(404).send('Envelope not found');
    }
    res.send(envelope);
});


module.exports = app;