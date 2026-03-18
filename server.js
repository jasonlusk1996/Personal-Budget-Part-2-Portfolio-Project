const express = require('express');
const app = express();
const run = require('./app.js');
const PORT = 3000;
app.use('/',run);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});