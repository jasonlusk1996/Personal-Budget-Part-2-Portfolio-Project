const express= require('express');
const app = express();
const envelopes = require('./envelopes.js');
app.use(express.json());

//returns an envelope object from the envelopes array that matches the provided id, or null if no match is found
function getEnvelopeById(id) {
    return envelopes.find(envelope => envelope.id === id)|| null;
}

//returns the index of an envelope in the envelopes array that matches the provided id, or -1 if no match is found
function getIndexById(id) {
    return envelopes.findIndex(envelope => envelope.id === id)|| -1;
}

//updates the budget of a specific envelope by subtracting the provided amount from the current budget
function updateBudget(id, amount) {
    const envelope = getEnvelopeById(id);
    if (envelope) {
        envelope.budget -= amount;
    }
}

//transfers a specified amount from one envelope to another based on the provided from and to ids and amount
function swapBudget(id1, id2, amount) {
    const envelope1 = getEnvelopeById(id1);
    const envelope2 = getEnvelopeById(id2);
    if (envelope1 && envelope2) {
        envelope1.budget -= Number(amount);
        envelope2.budget += Number(amount);
    }
}

//changes the budget of a specific envelope to the provided amount based on the provided id
function changeBudget(id, amount) {
    const envelope = getEnvelopeById(id);
    if (envelope) {
        envelope.budget = Number(amount);
    }
}

//updates all envelopes to have the same budget amount based on the provided amount
function evenBudget(amount) {
    for (let envelope of envelopes) {
        envelope.budget = Number(amount);
    }
}


module.exports = {
    getEnvelopeById,
    getIndexById,
    updateBudget,
    swapBudget,
    changeBudget,
    evenBudget
};