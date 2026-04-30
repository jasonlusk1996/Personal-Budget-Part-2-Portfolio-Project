const express= require('express');
const app = express();
app.use(express.json());
const pool = require('./db.js');

//returns an envelope object from the envelopes array that matches the provided id, or null if no match is found
async function getTableById(table,id) {
    const {rows} = await pool.query(`SELECT * FROM ${table} WHERE id=$1`,[id]);
    return rows[0]|| null;
}

//updates the budget of a specific envelope by subtracting the provided amount from the current budget
async function updateBudget(id, amount) {
    try{
    const res = await pool.query("SELECT budget FROM envelopes WHERE id=$1",[id]);
    if (res.rows.length > 0) {
        await pool.query("UPDATE envelopes SET budget= budget - $1 WHERE id=$2",[amount,id]);}
    } catch (err){
        console.log(err);
    }
}

//transfers a specified amount from one envelope to another based on the provided from and to ids and amount
async function swapBudget(id1, id2, amount) {
    try{
    const res1 = await pool.query("SELECT budget FROM envelopes WHERE id=$1",[id1]);
    const res2 = await pool.query("SELECT budget FROM envelopes WHERE id=$1",[id2]);
    if (res1.rows.length > 0 && res2.rows.length > 0) {
        await pool.query("UPDATE envelopes SET budget= budget - $1 WHERE id=$2",[amount,id1]);
        await pool.query("UPDATE envelopes SET budget= budget + $1 WHERE id=$2",[amount,id2]);}
    } catch (err){
        console.log(err);
        await pool.query ('ROLLBACK');
    }
}

//changes the budget of a specific envelope to the provided amount based on the provided id
async function changeBudget(id, amount) {
    try{
    const res = await pool.query("SELECT budget FROM envelopes WHERE id=$1",[id]);
    if (res.rows.length > 0) {
        await pool.query("UPDATE envelopes SET budget= $1 WHERE id=$2",[amount,id]);}
    } catch (err){
        console.log(err);
    }
}

//updates all envelopes to have the same budget amount based on the provided amount
async function evenBudget(amount) {
    try{
    const result = await pool.query("UPDATE envelopes SET budget = $1", [amount]);
    } catch (err){
        console.log(err);
    }
}


module.exports = {
    getEnvelopeById,
    updateBudget,
    swapBudget,
    changeBudget,
    evenBudget
};