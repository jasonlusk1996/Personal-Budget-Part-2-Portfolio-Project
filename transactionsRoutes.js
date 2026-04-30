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

//gets a specific transaction by id from the PG DB and returns it in the response
transactionRoutes.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try{
        const {rows} = await pool.query("SELECT * FROM transactions WHERE id = $1", [id]);
        if(rows.length===0){
            res.status(404).send("Transaction not found");
        }
        res.status(200).json(rows[0]);
    }catch(err){
        console.log(err);
        res.status(500).send("Database connection error");
    }
});

//deletes an transaction from the transactions table based on the provided id in the request parameters
transactionRoutes.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try{
      const {rows}= await pool.query("DELETE FROM transactions WHERE id = $1 RETURNING *",[id]);
      if (rows.length===0) {
        return res.status(404).send('Transaction not found');}
      res.status(204).send();}
    catch(err){
        console.log(err);
        res.status(500).send("Database connection error");
    }
});

module.exports = transactionRoutes;