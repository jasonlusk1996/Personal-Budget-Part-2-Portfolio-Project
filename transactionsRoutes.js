const express = require('express');
const app = express();
const pool = require("./db.js");
app.use(express.json());

//create a router for envelope-related routes and mount it on the /envelopes path
appRouter = express.Router();
app.use('/transactions', appRouter);