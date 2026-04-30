const express= require('express');
const app = express();
app.use(express.json());
const pool = require('./db.js');