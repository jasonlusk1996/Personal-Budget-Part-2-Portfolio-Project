const express = require('express');
const app = express();
const run = require('./app.js');
const PORT = 3000;
app.use('/',run);
// Start the server on the specified port and display a message in the console
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});