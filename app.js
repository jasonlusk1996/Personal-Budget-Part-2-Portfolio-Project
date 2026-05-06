const express = require('express');
const app = express();
const pool = require("./db.js");
const helper = require('./helper.js');
const { swaggerUi, swaggerSpec } = require('./swagger.js');
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//create a router for envelope-related routes and mount it on the /envelopes path
appRouter = express.Router();
app.use('/envelopes', appRouter);

/**
 * @swagger
 * /envelopes:
 *   get:
 *     summary: Get all envelopes
 *     tags: [Envelopes]
 *     responses:
 *       200:
 *         description: List of all envelopes
 */
appRouter.get('/', async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM envelopes");
        res.status(200).json(result.rows);
        }catch(err){
            console.log(err);
            res.status(500).send('Database connection error');
        }
});

/**
 * @swagger
 * /envelopes:
 *   post:
 *     summary: Create a new envelope
 *     tags: [Envelopes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Groceries
 *               budget:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Envelope created successfully
 *       400:
 *         description: Name and budget are required
 */
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

/**
 * @swagger
 * /envelopes/even:
 *   put:
 *     summary: Updates all envelopes to have the same budget amount
 *     tags: [Envelopes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: All budgets updated successfully
 *       400:
 *         description: Invalid amount
 *       500:
 *         description: Database connection error
 */
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

/**
 * @swagger
 * /envelopes/transfer/{from}/{to}:
 *   post:
 *     summary: Transfer budget between envelopes
 *     tags: [Envelopes]
 *     parameters:
 *       - in: path
 *         name: from
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: to
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Transfer successful
 *       404:
 *         description: One or both envelopes not found
 *       500:
 *         description: Database connection error
 */
appRouter.post('/transfer/:from/:to', async (req, res) => {
    const fromId= parseInt(req.params.from);
    const toId = parseInt(req.params.to);
    const { amount } = req.body || {};
    try{
      if (!(await helper.getTableById("envelopes",fromId)) || !(await helper.getTableById("envelopes",toId))) {
          return res.status(404).send('One or both envelopes not found');
      }

      if (amount <= 0) {
          return res.status(400).send('Invalid amount');
      }
      await helper.swapBudget(fromId, toId, amount);
      res.send('Transfer successful');
    } catch (err){
        console.log(err);
        res.status(500).send('Database connection error');
    }
});

/**
 * @swagger
 * /envelopes/{id}:
 *   get:
 *     summary: Get a specific envelope by ID
 *     tags: [Envelopes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The unique ID of the envelope
 *     responses:
 *       200:
 *         description: Envelope details found
 *       404:
 *         description: Envelope not found
 *       500:
 *         description: Database error
 */
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

/**
 * @swagger
 * /envelopes/{id}:
 *   delete:
 *     summary: Deletes a specific envelope by ID
 *     tags: [Envelopes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The unique ID of the envelope
 *     responses:
 *       204:
 *         description: Envelope deleted found
 *       404:
 *         description: Envelope not found
 *       500:
 *         description: Database error
 */
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
appRouter.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { amount } = req.body || {};
    try{
      if (!(await helper.getTableById("envelopes",id))) {
          return res.status(404).send('Envelope not found');
      }
      if (amount <= 0) {
          return res.status(400).send('Invalid amount');
      }
      await helper.changeBudget(id, amount);
      res.send('Budget updated successfully');
    } catch (err){
        console.log(err);
        res.status(500).send("Database connection error");
    }
});

//withdraws a specified amount from a specific envelope based on the provided id in the request parameters and amount in the request body
appRouter.post('/:id/withdraw', async (req, res) => {
    const id = parseInt(req.params.id);
    const { amount } = req.body || {};
    try{
    if (!(await helper.getTableById("envelopes",id))) {
        return res.status(404).send('Envelope not found');
    }
    if (amount <= 0) {
        return res.status(400).send('Invalid amount');
    }
    await helper.updateBudget(id, amount);
    res.send('Withdrawal successful');
} catch (err){
        console.log(err);
        res.status(500).send("Database connection error");
    }
});

module.exports = app;