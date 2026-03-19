const express= require('express');
const app = express();
const envelopes = require('./envelopes.js');
app.use(express.json());

function getEnvelopeById(id) {
    return envelopes.find(envelope => envelope.id === id)|| null;
}

function getIndexById(id) {
    return envelopes.findIndex(envelope => envelope.id === id)|| -1;
}

function updateBudget(id, amount) {
    const envelope = getEnvelopeById(id);
    if (envelope) {
        envelope.budget -= amount;
    }
}

function swapBudget(id1, id2) {
    const envelope1 = getEnvelopeById(id1);
    const envelope2 = getEnvelopeById(id2);
    if (envelope1 && envelope2) {
        const temp = envelope1.budget;
        envelope1.budget = envelope2.budget;
        envelope2.budget = temp;
    }
}

module.exports = {
    getEnvelopeById,
    getIndexById,
    updateBudget,
    swapBudget
};