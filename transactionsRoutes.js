const express = require('express');
const transactionRoutes = express();
const pool = require("./db.js");
transactionRoutes.use(express.json());

//create a router for envelope-related routes and mount it on the /envelopes path
appRouter = express.Router();
transactionRoutes.use('/transactions', appRouter);

module.exports = transactionRoutes;