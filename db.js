const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'db.env') });
const {Pool}=require('pg');
const resetDB=require('./resetDB');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
});

const dbConnect = async ()=>{
    try{
        const client = await pool.connect();
        console.log('Connection successful');
        client.release();
    } catch (err){
        console.log(err);
    }
};

dbConnect();

// Listen for termination signals (Ctrl+C, kill, etc.)
process.on('SIGINT', async () => {
    await resetDB(pool); // Pass the pool here
    process.exit();
});

module.exports= pool;