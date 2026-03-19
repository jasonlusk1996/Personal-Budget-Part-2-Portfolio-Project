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

app.delete('/envelopes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = helper.getIndexById(id);
    if (index === -1) {
        return res.status(404).send('Envelope not found');
    }
    envelopes.splice(index, 1);
    res.status(204).send('Envelope deleted successfully');
});

app.post('/envelopes/:id/withdraw', (req, res) => {
    const id = parseInt(req.params.id);
    const { amount } = req.body || {};

    if (!helper.getEnvelopeById(id)) {
        return res.status(404).send('Envelope not found');
    }

    if (amount <= 0) {
        return res.status(400).send('Invalid amount');
    }

    helper.updateBudget(id, amount);
    res.send('Withdrawal successful');
});

app.post('/envelopes/transfer/:from/:to', (req, res) => {
    const fromId= parseInt(req.params.from);
    const toId = parseInt(req.params.to);
    const { amount } = req.body || {};

    if (!helper.getEnvelopeById(fromId) || !helper.getEnvelopeById(toId)) {
        return res.status(404).send('One or both envelopes not found');
    }

    if (amount <= 0) {
        return res.status(400).send('Invalid amount');
    }

    helper.swapBudget(fromId, toId, amount);
    res.send('Transfer successful');
});

module.exports = app;