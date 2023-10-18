const express = require('express');
const errorMiddleware = require('./middleware/error')

const app = express();
app.use(express.json())
const product = require('./routes/productRoute');

app.use('/api/v1',product);

app.use(errorMiddleware);

module.exports = app;