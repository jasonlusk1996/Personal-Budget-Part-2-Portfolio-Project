const express = require('express');
const app = express();
const envelopes = require('./envelopes.js');
const helper = require('./helper.js');
app.use(express.json());

//create a router for envelope-related routes and mount it on the /envelopes path
appRouter = express.Router();
app.use('/envelopes', appRouter);

//gets all envelopes
app.get('/envelopes', (req, res) => {
    res.send(envelopes);
});

//adds new envelope to the envelopes array with a unique id, name, and budget
appRouter.post('/', (req, res) => {
    const { name, budget } = req.body || {};
    if(!name || !budget) {
        return res.status(400).send('Name and budget are required');
    }
    envelopes.push({ id: envelopes.length + 1, name, budget, spent: 0 });
    res.status(201).send('Envelope created successfully');
});

//updates all envelopes to have the same budget amount
appRouter.put('/even', (req, res) => {
    const { amount } = req.body || {};
    if (amount <= 0) {
        return res.status(400).send('Invalid amount');
    }
    helper.evenBudget(amount);
    res.send('All budgets updated successfully');
});

//transfers budget from one envelope to another based on the provided from and to ids and amount in the request body
appRouter.post('/transfer/:from/:to', (req, res) => {
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

//gets a specific envelope by id from the envelopes array and returns it in the response
appRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const envelope = helper.getEnvelopeById(id);
    if (!envelope) {
        return res.status(404).send('Envelope not found');
    }
    res.send(envelope);
});

//deletes an envelope from the envelopes array based on the provided id in the request parameters
appRouter.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = helper.getIndexById(id);
    if (index === -1) {
        return res.status(404).send('Envelope not found');
    }
    envelopes.splice(index, 1);
    res.status(204).send('Envelope deleted successfully');
});

//updates the budget of a specific envelope based on the provided id in the request parameters and amount in the request body
appRouter.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { amount } = req.body || {};
    if (!helper.getEnvelopeById(id)) {
        return res.status(404).send('Envelope not found');
    }
    if (amount <= 0) {
        return res.status(400).send('Invalid amount');
    }

    helper.changeBudget(id, amount);
    res.send('Budget updated successfully');
});

//withdraws a specified amount from a specific envelope based on the provided id in the request parameters and amount in the request body
appRouter.post('/:id/withdraw', (req, res) => {
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

module.exports = app;