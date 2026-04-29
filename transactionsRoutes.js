const express = require('express');
const transactionRoutes = express();
const pool = require("./db.js");
transactionRoutes.use(express.json());

module.exports = transactionRoutes;