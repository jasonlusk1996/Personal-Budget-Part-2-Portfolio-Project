const express = require('express');
const app = express();
const pool = require("./db.js");
const helper = require('./helper.js');
app.use(express.json());

//create a router for envelope-related routes and mount it on the /envelopes path
appRouter = express.Router();
app.use('/envelopes', appRouter);

//gets all envelopes
app.get('/envelopes', async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM envelopes");
        res.status(200).json(result.rows);
        }catch(err){
            console.log(err);
            res.status(500).send('Database connection error');
        }
});

//adds new envelope to the envelopes array with a unique id, name, and budget
appRouter.post('/', async (req, res) => {
    const { name, budget } = req.body || {};
    if(!name || !budget) {
        return res.status(400).send('Name and budget are required');
    }
    try{
        const { rows } = await pool.query("INSERT INTO envelopes (name, budget) VALUES ($1, $2)",[name, budget]);
        res.status(201).send('Envelope created successfully');
    }catch(err){
            console.log(err);
            res.status(500).send('Database connection error');
        }
});

//updates all envelopes to have the same budget amount
app.put('/even', async (req, res) => {
    const { amount } = req.body || {};
    if (amount <= 0) {
        return res.status(400).send('Invalid amount');
    }
    try{
      await helper.evenBudget(amount);
      res.send('All budgets updated successfully');
    } catch (err){
            console.log(err);
            res.status(500).send('Database connection error');
        }
});

//transfers budget from one envelope to another based on the provided from and to ids and amount in the request body
appRouter.post('/transfer/:from/:to', (req, res) => {
    const fromId= parseInt(req.params.from);
    const toId = parseInt(req.params.to);
    const { amount } = req.body || {};

    if (!helper.getEnvelopeById(fromId) || !helper.getEnvelopeById(toId)) {
        return res.status(404).send('One or both envelopes not found');
    }

    if (amount <= 0) {
        return res.status(400).send('Invalid amount');
    }

    helper.swapBudget(fromId, toId, amount);
    res.send('Transfer successful');
});

//gets a specific envelope by id from the envelopes array and returns it in the response
appRouter.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try{
        const {rows} = await pool.query("SELECT * FROM envelopes WHERE id = $1", [id]);
        if(rows.length===0){
            res.status(404).send("Envelope not found");
        }
        res.status(200).json(rows[0]);
    }catch(err){
        console.log(err);
        res.status(500).send("Database connection error");
    }
});

//deletes an envelope from the envelopes array based on the provided id in the request parameters
appRouter.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try{
      const {rows}= await pool.query("DELETE FROM envelopes WHERE id = $1 RETURNING *",[id]);
      if (rows.length===0) {
        return res.status(404).send('Envelope not found');}
      res.status(204).send();}
    catch(err){
        console.log(err);
        res.status(500).send("Database connection error");
    }
});

//updates the budget of a specific envelope based on the provided id in the request parameters and amount in the request body
appRouter.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { amount } = req.body || {};
    if (!helper.getEnvelopeById(id)) {
        return res.status(404).send('Envelope not found');
    }
    if (amount <= 0) {
        return res.status(400).send('Invalid amount');
    }

    helper.changeBudget(id, amount);
    res.send('Budget updated successfully');
});

//withdraws a specified amount from a specific envelope based on the provided id in the request parameters and amount in the request body
appRouter.post('/:id/withdraw', (req, res) => {
    const id = parseInt(req.params.id);
    const { amount } = req.body || {};

    if (!helper.getEnvelopeById(id)) {
        return res.status(404).send('Envelope not found');
    }

    if (amount <= 0) {
        return res.status(400).send('Invalid amount');
    }

    helper.updateBudget(id, amount);
    res.send('Withdrawal successful');
});

module.exports = app;