const express = require('express');
const transactionRoutes = express();
const pool = require("./db.js");
transactionRoutes.use(express.json());
const helper = require('./helper.js');

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of transactions
 */
transactionRoutes.get('/', async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM transactions");
        res.status(200).json(result.rows);
        }catch(err){
            console.log(err);
            res.status(500).send('Database connection error');
        }
});

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paydate:
 *                 type: date
 *                 example: 2026-01-01
 *               paymentamount:
 *                 type: number
 *                 example: 500 
 *               paymentrecipient:
 *                 type: string
 *                 example: Jim Fireworks
 *               envelopeid:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: pay date, payment amount, payment recipient, and envelope Id are required
 *       500:
 *         description: Database connection error
 */
transactionRoutes.post('/', async (req, res) => {
    const { paydate, paymentamount, paymentrecipient,envelopeid} = req.body || {};
    if(!paydate || !paymentamount|| !paymentrecipient|| !envelopeid) {
        return res.status(400).send('pay date, payment amount, payment recipient, and envelope Id are required');
    }
    try{
        const { rows } = await pool.query("INSERT INTO transactions (paydate, paymentamount, paymentrecipient, envelopeid) VALUES ($1, $2, $3, $4)",[paydate, paymentamount,paymentrecipient, envelopeid]);
        res.status(201).send('Transaction created successfully');
    }catch(err){
            console.log(err);
            res.status(500).send('Database connection error');
        }
});

/**
 * @swagger
 * /transactions/max:
 *   get:
 *     summary: Sorts all transactions to show largest payment amount first
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of all transactions sorted by largest first
 *       500:
 *         description: Database error
 */
transactionRoutes.get('/max', async (req, res) => {
    try{
        const {rows} = await pool.query("SELECT * FROM transactions ORDER BY paymentamount DESC");
        res.status(200).json(rows);
    }catch(err){
        console.log(err);
        res.status(500).send("Database connection error");
    }
});

//sorts all trasactionactions to show smallest payment amount first
transactionRoutes.get('/min', async (req, res) => {
    try{
        const {rows} = await pool.query("SELECT * FROM transactions ORDER BY paymentamount");
        res.status(200).json(rows);
    }catch(err){
        console.log(err);
        res.status(500).send("Database connection error");
    }
});

//gets all transactions related to a certain envelope
transactionRoutes.get('/envelope/:id', async (req, res) => {
    const envelopeid = parseInt(req.params.id);
    try{
        const {rows} = await pool.query("SELECT * FROM transactions WHERE envelopeid = $1", [envelopeid]);
        if(rows.length===0){
            return res.status(404).send("Transaction not found");
        }
        res.status(200).json(rows);
    }catch(err){
        console.log(err);
        res.status(500).send("Database connection error");
    }
});

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get a specific transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The unique ID of the transaction
 *     responses:
 *       200:
 *         description: Transaction details found
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Database error
 */
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

//Change which envelope a transaction belongs to based on the provided id in the request parameters and the new envelope id in the request body
transactionRoutes.post('/:id/transfer', async (req, res) => {
    const id = parseInt(req.params.id);
    const { envelopeId } = req.body || {};
    try{
    if (!(await helper.getTableById("transactions",id))) {
        return res.status(404).send('Transaction not found');
    }
    if (!(await helper.getTableById("envelopes",envelopeId))) {
        return res.status(404).send('Envelope not found');
    }
    await pool.query("UPDATE transactions SET envelopeid=$1 WHERE id=$2",[envelopeId,id]);
    res.send('Transfer successful');
} catch (err){
        console.log(err);
        res.status(500).send("Database connection error");
    }
});

module.exports = transactionRoutes;