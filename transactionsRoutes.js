const express = require('express');
const transactionRoutes = express();
const pool = require("./db.js");
transactionRoutes.use(express.json());

//gets all transactions
transactionRoutes.get('/', async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM transactions");
        res.status(200).json(result.rows);
        }catch(err){
            console.log(err);
            res.status(500).send('Database connection error');
        }
});

module.exports = transactionRoutes;