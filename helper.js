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

module.exports = {
    getEnvelopeById,
    getIndexById
};