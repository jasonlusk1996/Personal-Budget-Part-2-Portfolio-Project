const express = require('express');
const app = express();
const pool = require("./db.js");
app.use(express.json());