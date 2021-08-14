require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'))
});

app.listen(process.env.PORT, () => {
    console.log('Server is now running on: http://localhost:' + process.env.PORT)
});