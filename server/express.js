const path = require('path');
const express = require('express');
const app = express();

require('dotenv').config();
require('./middleware')(app);

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'))
});

app.listen(process.env.PORT, () => {
    console.log('Server is now running on: http://localhost:' + process.env.PORT)
});